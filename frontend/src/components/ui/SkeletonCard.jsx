import React from 'react';

const SkeletonCard = () => (
  <div className="glass rounded-2xl overflow-hidden">
    {/* Image skeleton */}
    <div className="skeleton h-52 w-full" />
    <div className="p-5 space-y-3">
      {/* Title */}
      <div className="skeleton h-5 w-3/4 rounded" />
      {/* Location */}
      <div className="skeleton h-4 w-1/2 rounded" />
      {/* Rating row */}
      <div className="flex gap-2">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
      {/* Price */}
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-6 w-24 rounded" />
        <div className="skeleton h-9 w-28 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
