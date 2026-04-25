import { headers } from "next/headers";
import { Post, Comment } from "@/components/PostCard";
import PostDetail from "@/components/PostDetail";
import { getPostBySlug, getPostComentsBySlug } from "@/lib/data";
import { getAllPostSlugs } from "@/lib/data";
import Script from "next/script";

export const revalidate = 3600; // revalidate every hour for production stability

export async function generateStaticParams() {
  const slugs: string[] = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post | null = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  const description = post.summary || post.excerpt || post.content?.slice(0, 160);

  return {
    title: post.title,
    description: description,
    alternates: {
      canonical: `https://blog.uyonoh.com/post/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: `https://blog.uyonoh.com/post/${slug}`,
      siteName: "Uyonoh's Blog",
      type: "article",
      publishedTime: post.created_at,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post = await getPostBySlug(slug);
  const comments: Comment[] = await getPostComentsBySlug(slug);

  if (!post) {
    return (
      <div className="text-center mt-10 text-zinc-500 dark:text-zinc-400">
        Post not found
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.created_at,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://blog.uyonoh.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Uyonoh",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog.uyonoh.com/logo.png"
      }
    },
    "description": post.summary || post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog.uyonoh.com/post/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetail post={post} postComments={comments} />
    </>
  );
}

