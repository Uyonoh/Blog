import React from "react";
import { useRouter } from "next/router";

// Define a more specific type for the post
// type Author = {
//   id: number;
//   username: string;
// }

type Post = {
  id: number;         // or string, depending on your backend
  title: string;
  summary: string;
  content: string;
  author: string;
};

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mt-4">{post.summary || post.content }</p>
      </div>
      <div className="bg-gray-100 p-4">
        <span className="text-gray-500 text-sm">{post.author}</span>
      </div>
    </div>
  );
};

export default PostCard;
