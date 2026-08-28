import React from 'react';

export function OverviewSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-md animate-shimmer" />
          <div className="h-4 w-96 rounded-md animate-shimmer" />
        </div>
        <div className="h-8 w-36 rounded-md animate-shimmer" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#16161A] border border-[#24242A] p-5 rounded-xl space-y-3">
            <div className="h-3.5 w-24 rounded animate-shimmer" />
            <div className="h-8 w-32 rounded animate-shimmer" />
            <div className="h-2 w-full rounded animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="h-16 w-full rounded-xl animate-shimmer" />

      <div className="bg-[#16161A] border border-[#24242A] rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#202026]">
          <div className="h-4 w-40 rounded animate-shimmer" />
          <div className="h-8 w-60 rounded-md animate-shimmer" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 w-full rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReserveSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md animate-shimmer" />
        <div className="h-4 w-80 rounded-md animate-shimmer" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#16161A] border border-[#24242A] p-5 rounded-xl space-y-3">
            <div className="h-4 w-28 rounded animate-shimmer" />
            <div className="h-7 w-36 rounded animate-shimmer" />
            <div className="h-3 w-full rounded animate-shimmer" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#16161A] border border-[#24242A] p-5 rounded-xl space-y-4">
          <div className="h-5 w-44 rounded animate-shimmer" />
          <div className="h-10 w-full rounded animate-shimmer" />
          <div className="h-10 w-full rounded animate-shimmer" />
          <div className="h-10 w-full rounded animate-shimmer" />
          <div className="h-10 w-full rounded animate-shimmer" />
        </div>
        <div className="lg:col-span-7 bg-[#16161A] border border-[#24242A] rounded-xl p-5 space-y-3">
          <div className="h-5 w-40 rounded animate-shimmer" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-full rounded animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrendsSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-md animate-shimmer" />
          <div className="h-4 w-80 rounded-md animate-shimmer" />
        </div>
        <div className="h-9 w-44 rounded-md animate-shimmer" />
      </div>

      <div className="h-20 w-full rounded-xl animate-shimmer" />

      <div className="bg-[#16161A] border border-[#24242A] p-6 rounded-xl space-y-4">
        <div className="h-4 w-48 rounded animate-shimmer" />
        <div className="h-72 w-full rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

export function RiskSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-md animate-shimmer" />
          <div className="h-4 w-80 rounded-md animate-shimmer" />
        </div>
        <div className="h-9 w-44 rounded-md animate-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#16161A] border border-[#24242A] p-6 rounded-xl space-y-4">
          <div className="h-5 w-40 rounded animate-shimmer" />
          <div className="h-60 w-full rounded-lg animate-shimmer" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-36 w-full rounded-xl animate-shimmer" />
          <div className="h-44 w-full rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ActionsSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-md animate-shimmer" />
          <div className="h-4 w-80 rounded-md animate-shimmer" />
        </div>
        <div className="h-9 w-44 rounded-md animate-shimmer" />
      </div>

      <div className="bg-[#16161A] border border-[#24242A] rounded-xl p-5 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 w-full rounded-lg animate-shimmer" />
        ))}
      </div>
    </div>
  );
}

export function DigitalTwinSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md animate-shimmer" />
        <div className="h-4 w-80 rounded-md animate-shimmer" />
      </div>
      <div className="h-[560px] w-full rounded-xl animate-shimmer" />
    </div>
  );
}

export function DataHealthSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md animate-shimmer" />
        <div className="h-4 w-80 rounded-md animate-shimmer" />
      </div>
      <div className="h-20 w-full rounded-xl animate-shimmer" />
      <div className="bg-[#16161A] border border-[#24242A] rounded-xl p-5 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-full rounded animate-shimmer" />
        ))}
      </div>
    </div>
  );
}
