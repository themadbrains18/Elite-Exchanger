import React from 'react';

const CardsSkeleton = () => {
  return (
    <div className="p-8 text-center">
      {/* Title Skeleton */}
      <h2 className="w-64 h-8 bg-gray-200 mx-auto mb-6 rounded-md"></h2>
      
      {/* Crypto Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm">
            {/* Icon Skeleton */}
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            
            {/* Text Skeleton */}
            <div className="w-24 h-4 bg-gray-200 mx-auto mb-4 rounded"></div>
            
            {/* Price Skeleton */}
            <div className="w-32 h-6 bg-gray-200 mx-auto mb-6 rounded"></div>
            
            {/* Graph Skeleton */}
            <div className="w-full h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsSkeleton;
