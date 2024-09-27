import React from 'react';

const SecuritySkeleton = () => {
  return (
    <section className="bg-gray-900 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4 w-32"></div>

      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="h-6 bg-gray-700 rounded w-48"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 w-10 bg-gray-700 rounded"></div>
              <div className="h-6 w-10 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-800 rounded w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-800 rounded w-full"></div>
          <div className="h-10 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySkeleton;