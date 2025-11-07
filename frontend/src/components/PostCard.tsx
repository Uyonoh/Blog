"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Define a more specific type for the post
// type Author = {
//   id: number;
//   username: string;
// }

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
  id: number;       // or string, depending on your backend
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
  topics: Topic[];
  html_content: string;
};

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/post/${post.slug}`);
  };

  const parseDate =  (date:string) => {
    date = date.split("T")[0];
    let dates:string[] = date.split("-");
    const today = new Date();
    if (dates[0] == today.getFullYear().toString()) {
      dates = dates.slice(1);
    }
    date = dates.join("-");
 
    return date;
  }

  const parseTopics = (topics:Topic[]) => {
    const names:string[] = topics.map((topic:Topic) => {;
      return topic.name
    });

    return names.join(" | ")
  }

  return (
    <div
      className="bg-white dark:bg-inherit shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* card head */}
      <div className="flex justify-between bg-gray-100 dark:bg-gray-500 p-4">
        <span className="text-gray-500 dark:text-gray-100 text-sm">
          {post.author}
        </span>
        <span className="text-blue-500 dark:text-yellow-500 text-sm">
          {parseTopics(post.topics)}
        </span>
      </div>

      {/* main body */}
      <div className="flex flex-col align-center justify-start relative h-82 w-full mt-2 overflow-hidden">
        <img
          src={post.image}
          alt="Image"
          className="w-full h-45 object-cover rounded-b-lg dark:text-gray-300"
        />
        <div className="p-2">
          <h2 className="w-auto text-xl font-semibold text-gray-800 dark:text-gray-300">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-white mt-4">{post.summary || post.content }</p>
        </div>
        
      </div>
      <div className="flex justify-between bg-gray-100 dark:bg-gray-500 p-4 text-gray-500 dark:text-gray-100">
        <span className="text-sm">{parseDate(post.created_at)}</span>
        <span className="text-sm">Likes: {post.likes_count}</span>
      </div>
    </div>
  );
};
