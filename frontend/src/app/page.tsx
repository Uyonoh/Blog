import { Post, PostCard } from "../components/PostCard";
import { getPosts } from "@/lib/data";
import type { SearchResponse } from "@/hooks/useSearch";
import PostPagination from "@/components/PostPagination";

export const revalidate = 2; // revalidate every 60 seconds

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = Number(query?.page ?? 1);

  const data: SearchResponse = await getPosts(page);
  const posts = data.results;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        No posts available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-2 pb-7">
      <h1 className="text-5xl font-bold text-center text-blue-600 dark:text-gray-200 mb-8">
        {/* Blog Posts */}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <PostPagination currentPage={data.page} totalPages={data.total_pages} />
    </div>
  );
}
