"use client";

export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 dark:border-gray-200" />
    </div>
  );
}
