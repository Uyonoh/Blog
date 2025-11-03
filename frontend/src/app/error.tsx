'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="text-center mt-10">
      <p className="text-red-500 mb-4">
        Failed to load posts. Please try again later.
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl"
      >
        Try again
      </button>
    </div>
  );
}
