import React from "react";
import { useRouter } from "next/router";

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
    var dates:string[] = date.split("-");
    const today = new Date();
    if (dates[0] == today.getFullYear().toString()) {
      dates = dates.slice(1);
    }
    date = dates.join("-");

    
    return date;
  }

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between bg-gray-100 p-4">
        <span className="text-gray-500 text-sm">{post.author}</span>
        <span className="text-blue-500 text-sm">Topic</span>
      </div>
      <div className="flex relative">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
          <p className="text-gray-600 mt-4">{post.summary || post.content }</p>
        </div>
        <img src={post.image} alt="Image" className="absolute bottom-0 right-0 w-25 h-25 object-cover rounded-t-lg" />
      </div>
      <div className="flex justify-between bg-gray-100 p-4">
        <span className="text-gray-500 text-sm">{parseDate(post.created_at)}</span>
        <span className="text-gray-500 text-sm">Likes: {post.likes_count}</span>
      </div>
    </div>
  );
};
