import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreCardSkeleton() {
  return (
    <div className="relative rounded-xl p-3 pb-14 border border-white/15 bg-black/40" style={{ minHeight: 140 }}>
      <div className="flex justify-center mb-2">
        <Skeleton className="rounded-md" style={{ width: 72, height: 72 }} />
      </div>
      <Skeleton className="w-full h-4 mb-1" />
      <Skeleton className="w-3/4 h-3" />
    </div>
  );
}