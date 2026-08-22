import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon } from 'lucide-react';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pb-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10" />
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#3AAFA9]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Profile</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-6 max-w-md mx-auto">
        {/* Streak counter */}
        <div className="flex flex-col items-center pt-2 pb-2">
          <Skeleton className="w-10 h-7" />
          <Skeleton className="w-36 h-3 mt-2" />
        </div>

        {/* Tempo balance card */}
        <div className="flex items-center justify-between rounded-2xl px-5 py-4 border border-[#D4AF37]/30 bg-white/5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-14 h-6" />
            </div>
          </div>
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center pt-2">
          <Skeleton className="w-28 h-28 rounded-full" />
        </div>

        {/* ELO rating card */}
        <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 px-5 py-4">
          <div className="space-y-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-12 h-7" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="w-10 h-3" />
            <Skeleton className="w-12 h-5" />
          </div>
        </div>

        {/* Stat buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        {/* Username field */}
        <div className="space-y-2">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>

        {/* Preset avatars */}
        <div className="space-y-3">
          <Skeleton className="w-24 h-3" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Save button */}
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}