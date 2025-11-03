export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <h1 className="text-5xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">
        Loading posts...
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              height: "30vh",
              borderRadius: "10px",
            }}
            className="bg-gray-200 dark:bg-gray-700"
          >{""}</div>
        ))}
      </div>
    </div>
  );
}
