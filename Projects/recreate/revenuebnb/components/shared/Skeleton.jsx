import React from 'react';

const Skeleton = () => {
  return (
    <div className="flex h-screen bg-blue-50">
      {/* Main Window - removed max-w-4xl to allow full width */}
      <div className="flex flex-col w-full bg-white rounded-lg shadow-lg m-4">
        {/* Header with Window Controls */}
        <div className="flex items-center p-4 border-b">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded-md w-64 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Sidebar - fixed width */}
          <div className="w-72 border-r p-4">
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area with Loading Spinner - takes remaining width */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default  Skeleton;