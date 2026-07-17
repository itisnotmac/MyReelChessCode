import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Comped Premium duration granted to every non-cashing entrant when a tournament ends.
const PREMIUM_COMP_DAYS = 90;

// ── Server-side chess terminal-state verification ───────────────────────────
// Replicates the frontend engine (ChessLogic.jsx) so the backend never trusts
// the client-written `result` field when settling cash-prize tournament games.
// Board encoding: 8x8 array of piece codes (uppercase = white). Row 0 = black
// back rank, row 7 = white back rank. castling = {whiteKingside,...}. enPassant = [r,c] | null.
function _isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function _pieceName(piece) {
  if (!piece) return null;
  return { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn',
           k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }[piece];
}
function _inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function _isEnemy(piece, target) {
  if (!piece || !target) return false;
  return _isWhite(piece) !== _isWhite(target);
}
function _isFriendly(piece, target) {
  if (!piece || !target) return false;
  return _isWhite(piece) === _isWhite(target);
}
function _rawMoves(board, row, col, enPassantTarget, castlingRights) {
  const piece = board[row][col];
  if (!piece) return [];
  const moves = [];
  const name = _pieceName(piece);
  const white = _isWhite(piece);
  const dir = white ? -1 : 1;
  if (name === 'pawn') {
    const startRow = white ? 6 : 1;
    if (_inBounds(row + dir, col) && !board[row + dir][col]) {
      moves.push([row + dir, col]);
      if (row === startRow && !board[row + 2 * dir][col]) moves.push([row + 2 * dir, col]);
    }
    for (const dc of [-1, 1]) {
      const nr = row + dir, nc = col + dc;
      if (_inBounds(nr, nc)) {
        if (board[nr][nc] && _isEnemy(piece, board[nr][nc])) moves.push([nr, nc]);
        if (enPassantTarget && enPassantTarget[0] === nr && enPassantTarget[1] === nc) moves.push([nr, nc]);
      }
    }
  } else if (name === 'knight') {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const nr = row + dr, nc = col + dc;
      if (_inBounds(nr, nc) && !_isFriendly(piece, board[nr][nc])) moves.push([nr, nc]);
    }
  } else if (name === 'bishop' || name === 'rook' || name === 'queen') {
    const dirs = [];
    if (name === 'bishop' || name === 'queen') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (name === 'rook' || name === 'queen') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of dirs) {
      let nr = row + dr, nc = col + dc;
      while (_inBounds(nr, nc)) {
        if (board[nr][nc]) {
          if (_isEnemy(piece, board[nr][nc])) moves.push([nr, nc]);
          break;
        }
        moves.push([nr, nc]);
        nr += dr; nc += dc;
      }
    }
  } else if (name === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr, nc = col + dc;
        if (_inBounds(nr, nc) && !_isFriendly(piece, board[nr][nc])) moves.push([nr, nc]);
      }
    }
    if (castlingRights) {
      const color = white ? 'white' : 'black';
      const homeRow = white ? 7 : 0;
      if (row === homeRow && col === 4) {
        if (castlingRights[color + 'Kingside'] && !board[homeRow][5] && !board[homeRow][6] && board[homeRow][7]) {
          if (!_squareAttacked(board, homeRow, 4, !white) && !_squareAttacked(board, homeRow, 5, !white) && !_squareAttacked(board, homeRow, 6, !white)) {
            moves.push([homeRow, 6]);
          }
        }
        if (castlingRights[color + 'Queenside'] && !board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] && board[homeRow][0]) {
          if (!_squareAttacked(board, homeRow, 4, !white) && !_squareAttacked(board, homeRow, 3, !white) && !_squareAttacked(board, homeRow, 2, !white)) {
            moves.push([homeRow, 2]);
          }
        }
      }
    }
  }
  return moves;
}
function _squareAttacked(board, row, col, byWhite) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || _isWhite(p) !== byWhite) continue;
      const moves = _rawMoves(board, r, c, null, null);
      if (moves.some(([mr, mc]) => mr === row && mc === col)) return true;
    }
  }
  return false;
}
function _findKing(board, white) {
  const king = white ? 'K' : 'k';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] === king) return [r, c];
  return null;
}
function _isInCheck(board, white) {
  const kp = _findKing(board, white);
  if (!kp) return false;
  return _squareAttacked(board, kp[0], kp[1], !white);
}
function _getLegalMoves(board, row, col, enPassantTarget, castlingRights) {
  const piece = board[row][col];
  if (!piece) return [];
  const white = _isWhite(piece);
  return _rawMoves(board, row, col, enPassantTarget, castlingRights).filter(([toR, toC]) => {
    const sim = board.map(r => [...r]);
    sim[toR][toC] = sim[row][col];
    sim[row][col] = null;
    if (_pieceName(piece) === 'pawn' && enPassantTarget && toR === enPassantTarget[0] && toC === enPassantTarget[1]) {
      sim[row][toC] = null;
    }
    return !_isInCheck(sim, white);
  });
}
function _hasAnyLegalMove(board, white, enPassantTarget, castlingRights) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || _isWhite(piece) !== white) continue;
      if (_getLegalMoves(board, r, c, enPassantTarget, castlingRights).length > 0) return true;
    }
  }
  return false;
}
// Validate that a stored board is a *legal* chess position — not merely a
// terminal one. A participant can write an arbitrary board string to their own
// OnlineGame record, so before accepting a checkmate we must reject forged
// positions: wrong king counts, pawns on the promotion ranks, adjacent kings,
// impossible material, or the side that just moved being left in check (you can
// never make a move that leaves your own king attacked). This closes the trivial
// "write an impossible checkmate pattern" attack without needing full move
// history replay.
function _isLegalPosition(board, whiteToMove) {
  if (!Array.isArray(board) || board.length !== 8) return false;
  let wk = 0, bk = 0, wp = 0, bp = 0, wTotal = 0, bTotal = 0;
  for (let r = 0; r < 8; r++) {
    if (!Array.isArray(board[r]) || board[r].length !== 8) return false;
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p === null || p === undefined) continue;
      if (!/^[KQRBNPkqbnp]$/.test(p)) return false;
      if (p === 'K') wk++;
      else if (p === 'k') bk++;
      else if (p === 'P') { wp++; if (r === 0 || r === 7) return false; }
      else if (p === 'p') { bp++; if (r === 0 || r === 7) return false; }
      if (_isWhite(p)) wTotal++; else bTotal++;
    }
  }
  if (wk !== 1 || bk !== 1) return false;
  if (wp > 8 || bp > 8) return false;
  if (wTotal > 16 || bTotal > 16) return false;
  const wkp = _findKing(board, true);
  const bkp = _findKing(board, false);
  if (!wkp || !bkp) return false;
  if (Math.abs(wkp[0] - bkp[0]) <= 1 && Math.abs(wkp[1] - bkp[1]) <= 1) return false;
  // The side that just moved (= !whiteToMove) can never be left in check.
  if (_isInCheck(board, !whiteToMove)) return false;
  return true;
}

// Recompute the game result from the stored post-move board. `whiteToMove` is the
// side to move (the side that may be checkmated/stalemated).
function verifyTerminalResult(board, whiteToMove, enPassant, castling) {
  if (!Array.isArray(board) || board.length !== 8) return 'in_progress';
  const inCheck = _isInCheck(board, whiteToMove);
  const hasMoves = _hasAnyLegalMove(board, whiteToMove, enPassant, castling);
  if (inCheck && !hasMoves) return whiteToMove ? 'black_wins' : 'white_wins'; // sideToMove is mated
  if (!inCheck && !hasMoves) return 'draw'; // stalemate
  return 'in_progress';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { game_id } = await req.json();
    if (!game_id) return Response.json({ error: 'Missing game_id' }, { status: 400 });

    const games = await base44.asServiceRole.entities.OnlineGame.filter({ id: game_id });
    const game = games[0];
    if (!game) return Response.json({ error: 'Game not found' }, { status: 404 });
    if (!game.tournament_id) return Response.json({ ok: true, message: 'Not a tournament game' });

    // Only a participant may settle the bracket outcome
    if (game.host_id !== user.id && game.guest_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (game.tournament_settled) return Response.json({ ok: true, message: 'Already settled' });

    // Recompute the terminal state from the stored board — never trust the
    // client-written `result`/`status` (a participant can write those to their
    // own record). Only settle if the board is genuinely checkmate/stalemate.
    let board, enPassant = null, castling = null;
    try { board = JSON.parse(game.board || '[]'); } catch { board = null; }
    try { enPassant = game.en_passant ? JSON.parse(game.en_passant) : null; } catch {}
    try { castling = game.castling ? JSON.parse(game.castling) : null; } catch {}
    if (!castling) {
      castling = { whiteKingside: true, whiteQueenside: true, blackKingside: true, blackQueenside: true };
    }
    // Reject forged/unreachable terminal boards before trusting the result.
    if (!_isLegalPosition(board, game.is_white_turn)) {
      console.error('settleTournamentGame: illegal/forged terminal board rejected');
      return Response.json({ error: 'Result could not be verified' }, { status: 403 });
    }
    const verifiedResult = verifyTerminalResult(board, game.is_white_turn, enPassant, castling);
    if (verifiedResult === 'in_progress') {
      return Response.json({ ok: true, message: 'Game not finished' });
    }
    if (verifiedResult !== game.result) {
      // Stored result doesn't match the server-verified outcome — reject.
      console.error(`settleTournamentGame: result mismatch (stored=${game.result}, verified=${verifiedResult})`);
      return Response.json({ error: 'Result could not be verified' }, { status: 403 });
    }

    const tournamentId = game.tournament_id;
    const round = game.tournament_round || 0;
    const entries = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id: tournamentId,
      payment_status: 'paid',
    });
    const hostEntry = entries.find(e => e.user_id === game.host_id);
    const guestEntry = entries.find(e => e.user_id === game.guest_id);

    // Decide winner & loser (draw -> higher seed / lower bracket_position advances)
    let winnerId, loserId;
    if (game.result === 'white_wins') {
      winnerId = game.host_id; loserId = game.guest_id;
    } else if (game.result === 'black_wins') {
      winnerId = game.guest_id; loserId = game.host_id;
    } else {
      const hostPos = hostEntry?.bracket_position ?? Infinity;
      const guestPos = guestEntry?.bracket_position ?? Infinity;
      winnerId = hostPos <= guestPos ? game.host_id : game.guest_id;
      loserId = winnerId === game.host_id ? game.guest_id : game.host_id;
    }

    // 3rd-place playoff: winner takes 3rd, loser takes 4th. Both already eliminated.
    if (game.is_third_place) {
      const winnerEntry = entries.find(e => e.user_id === winnerId);
      const loserEntry = entries.find(e => e.user_id === loserId);
      if (winnerEntry) await base44.asServiceRole.entities.TournamentEntry.update(winnerEntry.id, { placement: 3 });
      if (loserEntry) await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, { placement: 4 });
      await base44.asServiceRole.entities.OnlineGame.update(game_id, { tournament_settled: true });
      await updateResults(base44, tournamentId, { 3: winnerId, 4: loserId });
      return Response.json({ ok: true, settled: true, third: winnerId, fourth: loserId });
    }

    // Normal bracket game: eliminate the loser and record the round of elimination
    const loserEntry = entries.find(e => e.user_id === loserId);
    if (loserEntry && !loserEntry.eliminated) {
      await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, {
        eliminated: true,
        eliminated_round: round,
      });
    }
    await base44.asServiceRole.entities.OnlineGame.update(game_id, { tournament_settled: true });

    const refreshed = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id: tournamentId,
      payment_status: 'paid',
    });
    const survivors = refreshed.filter(e => !e.eliminated);

    if (survivors.length === 1) {
      // The final just completed — resolve the full top 8.
      const finalRound = round;
      const championEntry = survivors[0];
      await base44.asServiceRole.entities.TournamentEntry.update(championEntry.id, { placement: 1 });
      if (loserEntry) await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, { placement: 2 });

      // 5th–8th = the four quarterfinal losers (eliminated in the QF round = finalRound - 2)
      const qfRound = finalRound - 2;
      const qfLosers = refreshed.filter(e => e.eliminated && (e.eliminated_round || 0) === qfRound);
      if (qfLosers.length > 0) {
        await base44.asServiceRole.entities.TournamentEntry.bulkUpdate(
          qfLosers.map(e => ({ id: e.id, placement: 5 }))
        );
      }

      // Non-winners = everyone eliminated before the QF round. They get 3 months comped Premium.
      const nonWinners = refreshed.filter(e => e.eliminated && (e.eliminated_round || 0) < qfRound);
      let premiumGranted = 0;
      if (nonWinners.length > 0) {
        const until = new Date(Date.now() + PREMIUM_COMP_DAYS * 24 * 60 * 60 * 1000).toISOString();
        try {
          for (let i = 0; i < nonWinners.length; i += 500) {
            const batch = nonWinners.slice(i, i + 500).map(e => ({ id: e.user_id, premium_until: until }));
            await base44.asServiceRole.entities.User.bulkUpdate(batch);
          }
          premiumGranted = nonWinners.length;
          console.log(`Granted 3-month Premium to ${premiumGranted} non-winners`);
        } catch (gErr) {
          console.error('Premium grant failed:', gErr.message);
        }
      }

      await base44.asServiceRole.entities.Tournament.update(tournamentId, { status: 'completed' });
      await updateResults(base44, tournamentId, { 1: championEntry.user_id, 2: loserId });
      if (qfLosers.length > 0) {
        await updateResultsTier(base44, tournamentId, '5_8', qfLosers.map(e => e.user_id));
      }
      return Response.json({
        ok: true,
        settled: true,
        champion: championEntry.user_id,
        runner_up: loserId,
        premium_granted: premiumGranted,
      });
    }

    // Otherwise advance the bracket (pairs the next round, and stages the 3rd-place
    // match once the finalists are determined).
    try {
      await base44.functions.invoke('pairTournamentRound', { tournament_id: tournamentId });
    } catch (e) {
      console.error('pairTournamentRound invoke failed:', e.message);
    }

    return Response.json({ ok: true, settled: true, loser: loserId });
  } catch (error) {
    console.error('settleTournamentGame error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Merge placements into the tournament's results JSON (id + display name).
async function updateResults(base44, tournamentId, placements) {
  try {
    const t = (await base44.asServiceRole.entities.Tournament.filter({ id: tournamentId }))[0];
    let results = {};
    try { results = t?.results ? JSON.parse(t.results) : {}; } catch {}
    for (const [place, userId] of Object.entries(placements)) {
      const users = await base44.asServiceRole.entities.User.filter({ id: userId });
      const name = users[0]?.full_name || users[0]?.email || 'Player';
      results[place] = { id: userId, name };
    }
    await base44.asServiceRole.entities.Tournament.update(tournamentId, { results: JSON.stringify(results) });
  } catch (e) {
    console.error('updateResults failed:', e.message);
  }
}

// Merge a tier (e.g. 5th-8th) as an array of {id, name} into the results JSON.
async function updateResultsTier(base44, tournamentId, key, userIds) {
  try {
    const t = (await base44.asServiceRole.entities.Tournament.filter({ id: tournamentId }))[0];
    let results = {};
    try { results = t?.results ? JSON.parse(t.results) : {}; } catch {}
    const named = [];
    for (const userId of userIds) {
      const users = await base44.asServiceRole.entities.User.filter({ id: userId });
      const name = users[0]?.full_name || users[0]?.email || 'Player';
      named.push({ id: userId, name });
    }
    results[key] = named;
    await base44.asServiceRole.entities.Tournament.update(tournamentId, { results: JSON.stringify(results) });
  } catch (e) {
    console.error('updateResultsTier failed:', e.message);
  }
}