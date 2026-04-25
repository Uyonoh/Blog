import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, MessageCircle } from 'lucide-react';

export type Comment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
};

export type Like = {
  id: number;
  user: string;
};

export type Topic = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  image: string;
  summary: string;
  content: string;
  author: string;
  created_at: string;
  likes: Like[];
  likes_count: number;
  liked_by_user: boolean;
  comments: Comment[];
  comments_count: number;
  topics: Topic[];
  html_content: string;
  excerpt: string;
};

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const parseDate = (date: string) => {
    date = date.split("T")[0];
    let dates: string[] = date.split("-");
    const today = new Date();
    if (dates[0] === today.getFullYear().toString()) {
      dates = dates.slice(1);
    }
    return dates.join("-");
  };

  return (
    <article
      className="bg-white dark:bg-zinc-900 shadow-md dark:shadow-none border border-transparent dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
    >
      <Link href={`/post/${post.slug}`} className="block flex-grow group">
        <header className="flex justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
            {post.author}
          </span>

          <div className="flex gap-2">
            {post.topics.slice(0, 2).map((topic, key) => (
              <span key={key} className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                #{topic.name}
              </span>
            ))}
          </div>
        </header>

        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.image}
            alt={`Cover image for ${post.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt || post.summary}
          </p>
        </div>
      </Link>

      <footer className="flex justify-between items-center p-5 pt-0 mt-auto text-zinc-500 dark:text-zinc-500">
        <time dateTime={post.created_at} className="text-sm font-medium">
          {parseDate(post.created_at)}
        </time>

        <div className="flex items-center gap-4">
          <span className="text-sm flex items-center gap-1.5" aria-label={`${post.comments_count} comments`}>
            <MessageCircle size={16} />
            <span>{post.comments_count}</span>
          </span>
          <span className="text-sm flex items-center gap-1.5" aria-label={`${post.likes_count} likes`}>
            <ThumbsUp size={16} />
            <span>{post.likes_count}</span>
          </span>
        </div>
      </footer>
    </article>
  );
};

