import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = user.id;

    // Purge the player's account record (stats, balance, streaks) scoped to
    // this user. Service role bypasses RLS so the user can delete their own row
    // even though PlayerAccount delete is admin-only by default.
    await base44.asServiceRole.entities.PlayerAccount.deleteMany({ user_id: userId });

    // Permanently remove the account credentials themselves.
    await base44.asServiceRole.entities.User.delete(userId);

    return Response.json({ success: true, deletedUserId: userId });
  } catch (error) {
    console.error('deleteUserAccount failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});