"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp, MessageCircle, Heart } from 'lucide-react';

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
  comments_count: number;
  topics: Topic[];
  html_content: string;
  excerpt: string;
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

    return names //names.join(" | ")
  }

  return (
    <div
      className="bg-white dark:bg-inherit shadow-lg dark:shadow-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:scale-102 transition-shadow transition-transform duration-300"
      onClick={handleClick}
    >
      {/* card head */}
      <div className="flex justify-between bg-gray-100 dark:bg-gray-500 p-4">
        <span className="text-gray-500 dark:text-gray-100 text-sm">
          {post.author}
        </span>

        {/* Topic */}
        <div className="topics">
          {parseTopics(post.topics).map((topic, key) =>{
            return <span key={key} className="text-blue-500 dark:text-yellow-500 text-sm cursor-pointer">{topic}</span>
          })}
        </div>
        {/* <span className="text-blue-500 dark:text-yellow-500 text-sm">
          {parseTopics(post.topics)}
        </span> */}
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
          <p className="text-gray-500 dark:text-gray-400 mt-4">{ post.excerpt || post.summary }</p>
        </div>
        
      </div>

      {/* Footer */}
      <div className="flex justify-between bg-gray-100 dark:bg-gray-500 p-4 text-gray-500 dark:text-gray-100">
        <span className="text-sm">{parseDate(post.created_at)}</span>

        {/* Favourites, comments, likes */}
        <div className="flex justify-between gap-2">
          {/* <span className="text-sm flex gap-1">
            <Heart size={18} />
            <span>20</span>
          </span> */}
          <span className="text-sm flex gap-1">
            <MessageCircle size={18} />
            <span>{post.comments_count}</span>
          </span>
          <span className="text-sm flex gap-1">
            <ThumbsUp size={18} />
            <span>{post.likes_count}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
