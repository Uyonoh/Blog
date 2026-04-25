import { Post, PostCard } from "../components/PostCard";
import { getPosts } from "@/lib/data";
import type { SearchResponse } from "@/hooks/useSearch";
import PostPagination from "@/components/PostPagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Engineering Insights",
  description:
    "Browse the latest articles on software architecture, frontend performance, and technical SEO.",
};

export const revalidate = 3600; // revalidate every hour

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
      <div className="text-center mt-20 text-zinc-500 dark:text-zinc-400">
        <p className="text-xl">No posts available at the moment.</p>
        <p className="mt-2 text-sm">Please check back later.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 pt-12 pb-20">
      <section className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          Engineering{" "}
          <span className="text-blue-600 dark:text-blue-400">Insights</span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl">
          Deep dives into modern web technologies and software development
          practices.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-16">
        <PostPagination currentPage={data.page} totalPages={data.total_pages} />
      </div>
    </main>
  );
}
