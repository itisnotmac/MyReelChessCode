import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Loads the current user's one-time feature unlocks (UserPurchase records
 * with item_type 'feature') and exposes helpers to check / refresh them.
 */
export function useFeatureUnlocks(userId) {
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
      setUnlocks(featureIds);
    } catch (e) {
      console.error('Failed to load feature unlocks:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUnlocks();
  }, [fetchUnlocks]);

  const hasUnlock = useCallback(
    (featureId) => unlocks.has(featureId),
    [unlocks]
  );

  return { unlocks, hasUnlock, loading, refetch: fetchUnlocks };
}