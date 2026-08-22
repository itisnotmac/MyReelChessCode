import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Loads the current user's one-time feature unlocks from two sources:
 *  - UserPurchase records (purchased via Stripe checkout)
 *  - user.feature_unlocks (admin-granted, comma-separated IDs on the User entity)
 */
export function useFeatureUnlocks(user) {
  const userId = user?.id;
  const grantedUnlocks = user?.feature_unlocks;
  const [unlocks, setUnlocks] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchUnlocks = useCallback(async () => {
    if (!userId) {
      setUnlocks(new Set());
      setLoading(false);
      return;
    }
    try {
      const purchases = await base44.entities.UserPurchase.filter({ user_id: userId });
      const featureIds = new Set(
        purchases
          .filter((p) => p.item_type === 'feature')
          .map((p) => p.item_id)
      );
      // Merge admin-granted unlocks from the user's feature_unlocks field
      if (grantedUnlocks) {
        grantedUnlocks
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((id) => featureIds.add(id));
      }
      setUnlocks(featureIds);
    } catch (e) {
      console.error('Failed to load feature unlocks:', e);
    } finally {
      setLoading(false);
    }
  }, [userId, grantedUnlocks]);

  useEffect(() => {
    fetchUnlocks();
  }, [fetchUnlocks]);

  const hasUnlock = useCallback(
    (featureId) => unlocks.has(featureId),
    [unlocks]
  );

  return { unlocks, hasUnlock, loading, refetch: fetchUnlocks };
}