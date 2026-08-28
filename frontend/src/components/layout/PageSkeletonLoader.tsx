import React from 'react';

export default function PageSkeletonLoader() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-md animate-shimmer" />
        <div className="h-4 w-96 rounded-md animate-shimmer" />
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#16161A] border border-[#24242A] p-5 rounded-xl space-y-3">
            <div className="h-3.5 w-24 rounded animate-shimmer" />
            <div className="h-8 w-32 rounded animate-shimmer" />
            <div className="h-2.5 w-full rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-[#16161A] border border-[#24242A] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#222228]">
          <div className="h-4 w-40 rounded animate-shimmer" />
          <div className="h-7 w-48 rounded animate-shimmer" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
