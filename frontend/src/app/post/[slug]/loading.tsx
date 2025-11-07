import React from "react";

export default function PostDetailSkeleton() {
  return (
    <>
    <div className="flex flex-col max-w-2xl mx-auto px-6 py-12 animate-pulse">
      {/* Author Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md"
          ></div>
        ))}
      </div>

      {/* Title */}
      <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      {/* Image */}
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>

      {/* Content Lines */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"
          ></div>
        ))}
      </div>

      {/* Divider */}
      <hr className="my-10 border-gray-300 dark:border-gray-700" />

      {/* Like Button Placeholder */}
      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-10"></div>

      {/* Comments Section */}
      <div>
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg space-y-2"
            >
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
