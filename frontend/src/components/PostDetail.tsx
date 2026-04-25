import React from "react";
import Image from "next/image";
import { Post, Comment } from "@/components/PostCard";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { md } from "@/lib/markdown";
import CommentSection from "@/components/CommentSection";

// Styles
import "@/styles/posts.css";

type Props = {
  post: Post;
  postComments: Comment[];
};

export default function PostDetail({ post, postComments }: Props) {
  const html = md.render(post.content);

  return (
    <article className="max-w-4xl mx-auto px-6 py-12" itemScope itemType="https://schema.org/BlogPosting">
      <header className="mb-12">
        {/* Topic tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.topics.map((topic, index) => (
            <span 
              key={index} 
              className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold"
            >
              #{topic.name}
            </span>
          ))}
        </div>

        <h1 
          className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-6"
          itemProp="headline"
        >
          {post.title}
        </h1>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-zinc-500 font-bold">{post.author[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="text-zinc-900 dark:text-zinc-100 font-bold" itemProp="author">
              {post.author}
            </p>
            <time 
              dateTime={post.created_at} 
              className="text-zinc-500 text-sm"
              itemProp="datePublished"
            >
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </header>

      <div className="relative aspect-video w-full mb-10 overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={post.image}
          alt={`Cover image for ${post.title}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 896px"
          itemProp="image"
        />
      </div>

      {post.excerpt && (
        <p className="text-xl text-zinc-600 dark:text-zinc-400 italic mb-10 leading-relaxed text-center px-4">
          "{post.excerpt}"
        </p>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-16" itemProp="articleBody">
        {html && <SyntaxHighlighter htmlContent={html} />}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <CommentSection 
        slug={post.slug}
        initialComments={postComments}
        initialLikes={post.likes_count}
        postLikes={post.likes}
      />
    </article>
  );
}


// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }