import { Post, PostCard } from "../components/PostCard";
import { getPosts } from "@/lib/data";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Page() {
  const posts: Post[] = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        No posts available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center text-blue-600 dark:text-gray-200 mb-8">
        {/* Blog Posts */}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
