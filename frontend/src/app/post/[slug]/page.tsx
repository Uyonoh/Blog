import { headers } from "next/headers";
import { Post, Comment } from "@/components/PostCard";
import PostDetail from "@/components/PostDetail";
import { getPostBySlug, getPostComentsBySlug } from "@/lib/data";
import { getAllPostSlugs } from "@/lib/data";

export const revalidate = 60; // revalidate every 60 seconds

export async function generateStaticParams() {
  const slugs: string[] = await getAllPostSlugs(); // e.g. ["my-first-post", "another-post"]

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post | null = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Uyonoh's Blog",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: `${post.title} | Uyonoh's Blog`,
    description: post.summary || post.content?.slice(0, 150) || "Read this post on Uyonoh's Blog.",
    openGraph: {
      title: post.title,
      description: post.summary || post.content?.slice(0, 150),
      url: `https://blog.uyonoh.com/post/${slug}`,
      type: "article",
      images: [
        {
          // url: post.thumbnail || "/default-thumbnail.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.content?.slice(0, 150),
      // images: [post.thumbnail || "/default-thumbnail.jpg"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // console.log("params:", params);
  

  const post: Post = await getPostBySlug(slug);
  const comments: Comment[] = await getPostComentsBySlug(slug);

  if (!post) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Failed to retrieve post
      </div>
    );
  }

  return (
    <div>
      <PostDetail post={post} postComments={comments} />
    </div>
  );
}
