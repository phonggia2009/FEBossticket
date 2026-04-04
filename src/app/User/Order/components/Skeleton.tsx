import React from 'react';

export const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4">
        <div className="w-20 h-28 bg-zinc-800 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 bg-zinc-800 rounded w-2/3" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
          <div className="h-3 bg-zinc-800 rounded w-1/3" />
          <div className="h-3 bg-zinc-800 rounded w-2/5" />
        </div>
      </div>
    ))}
  </div>
);