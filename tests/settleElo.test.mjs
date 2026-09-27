import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectPlayerAccount } from '../base44/shared/playerAccount.ts';

// Execute the production request handler with an in-memory SDK. No account or
// deployed function is changed by these tests.
const source = readFileSync(new URL('../base44/functions/settleElo/entry.ts', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '');

function fixture({ result = 'white_wins', host = {}, guest = {}, game = {}, caller = 'host' } = {}) {
  const doc = { id: 'game-1', status: 'finished', result, host_id: 'host', guest_id: 'guest', ...game };
  const accounts = [
    { id: 'host-account', user_id: 'host', elo: 1200, peak_elo: 1200, ...host },
    { id: 'guest-account', user_id: 'guest', elo: 1200, peak_elo: 1200, ...guest },
  ];
  const writes = [];
  const entities = {
    OnlineGame: {
      filter: async () => [{ ...doc }],
      update: async (id, data) => { writes.push({ id, data }); Object.assign(doc, data); return { ...doc }; },
    },
    PlayerAccount: {
      filter: async ({ user_id }) => accounts.filter(a => a.user_id === user_id).map(a => ({ ...a })),
      create: async data => { const account = { id: `new-${data.user_id}`, ...data }; accounts.push(account); return { ...account }; },
      update: async (id, data) => {
        writes.push({ id, data });
        const account = accounts.find(a => a.id === id);
        Object.assign(account, data);
        return { ...account };
      },
    },
  };
  const sdk = { auth: { me: async () => caller ? { id: caller } : null }, asServiceRole: { entities } };
  let handler;
  new Function('createClientFromRequest', 'selectPlayerAccount', 'Deno', source)(
    () => sdk, selectPlayerAccount, { serve: callback => { handler = callback; } },
  );
  const invoke = async () => {
    const response = await handler(new Request('https://example.test/settleElo', {
      method: 'POST', body: JSON.stringify({ game_id: doc.id }),
    }));
    return { status: response.status, data: await response.json() };
  };
  return { invoke, accounts, writes, doc };
}

for (const result of ['white_wins', 'black_wins']) test(`${result}: both ratings change and only the winner gains a peak`, async () => {
  const f = fixture({ result });
  const { data } = await f.invoke();
  const delta = result === 'white_wins' ? 16 : -16;
  assert.equal(data.settled, true);
  assert.equal(f.accounts[0].elo, 1200 + delta);
  assert.equal(f.accounts[1].elo, 1200 - delta);
  assert.equal(f.accounts[0].peak_elo, Math.max(1200, 1200 + delta));
  assert.equal(f.accounts[1].peak_elo, Math.max(1200, 1200 - delta));
  assert.deepEqual(JSON.parse(f.doc.elo_deltas), { host: delta, guest: -delta });
});

test('draw between unequal ratings adjusts both ratings', async () => {
  const f = fixture({ result: 'draw', host: { elo: 1400, peak_elo: 1500 } });
  await f.invoke();
  assert.equal(f.accounts[0].elo, 1392);
  assert.equal(f.accounts[1].elo, 1208);
  assert.equal(f.accounts[0].peak_elo, 1500);
});

test('loss preserves pre-game rating as peak when legacy peak is missing or too low', async () => {
  for (const peak_elo of [undefined, 1200]) {
    const f = fixture({ result: 'black_wins', host: { elo: 1400, peak_elo } });
    await f.invoke();
    assert.equal(f.accounts[0].peak_elo, 1400);
    assert.ok(f.accounts[0].elo < 1400);
  }
});

test('guest peak also preserves the pre-game rating after a loss', async () => {
  const f = fixture({ guest: { elo: 1400, peak_elo: undefined } });
  await f.invoke();
  assert.equal(f.accounts[1].peak_elo, 1400);
});

test('repeated completed settlement returns persisted deltas without rating writes', async () => {
  const f = fixture();
  await f.invoke();
  const previousWrites = f.writes.length;
  const { data } = await f.invoke();
  assert.equal(data.reason, 'already_settled');
  assert.deepEqual(data.deltas, { host: 16, guest: -16 });
  assert.equal(f.writes.length, previousWrites);
  assert.equal(f.accounts[0].elo, 1216);
});

test('online BlitzSchach follows the same rating rules', async () => {
  const f = fixture({ game: { game_mode: 'blitz' } });
  await f.invoke();
  assert.equal(f.accounts[0].elo, 1216);
});

test('missing accounts start at 1200 and are updated', async () => {
  const f = fixture();
  f.accounts.length = 0;
  await f.invoke();
  assert.equal(f.accounts.find(a => a.user_id === 'host').elo, 1216);
  assert.equal(f.accounts.find(a => a.user_id === 'guest').peak_elo, 1200);
});

test('unfinished, invalid, self-play and unauthorized requests cannot change ratings', async () => {
  for (const options of [
    { game: { status: 'active' } },
    { result: 'in_progress' },
    { result: 'abandoned' },
    { game: { guest_id: 'host' } },
    { caller: 'spectator' },
    { caller: null },
  ]) {
    const f = fixture(options);
    await f.invoke();
    assert.equal(f.writes.length, 0);
  }
});
