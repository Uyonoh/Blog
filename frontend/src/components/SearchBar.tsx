"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useSearch(query);

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-full rounded-lg border px-4 py-2 
                   dark:bg-gray-900 dark:border-gray-700"
      />

      {loading && (
        <div className="absolute left-0 right-0 mt-2 text-sm text-gray-500">
          Searching…
        </div>
      )}

      {error && (
        <div className="absolute left-0 right-0 mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {data && data.results.length > 0 && (
        <ul
          className="absolute z-50 mt-2 w-full rounded-lg border 
                       bg-white dark:bg-gray-900 dark:border-gray-700"
        >
          {data.results.map((post) => (
            <li
              key={post.id}
              className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Link href={`/post/${post.slug}`} onClick={(e) => setQuery("")}>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && data.results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute left-0 right-0 mt-2 text-sm text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}
