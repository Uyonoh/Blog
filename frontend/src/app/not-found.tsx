"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const faces = [
    "(>_<)",
    "(¬_¬)",
    "(╯°□°）╯︵ ┻━┻",
    "(._.)",
    "(•_•)",
    "(×_×)",
    "(ಥ﹏ಥ)",
    "(°ロ°)",
    "(ʘ‿ʘ)",
    "(-_-;)",
  ];

  const face = useMemo(() => faces[Math.floor(Math.random() * faces.length)], []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none">
      <div className="text-5xl mb-4 font-mono text-gray-800 dark:text-gray-100">
        {face}
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or might have been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
                   rounded-2xl border border-gray-300 dark:border-gray-700 
                   text-gray-800 dark:text-gray-100 
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
