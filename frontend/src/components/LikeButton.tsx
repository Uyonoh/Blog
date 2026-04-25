"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from 'lucide-react';
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { Like } from "./PostCard";

type LikeButtonProps = {
  slug: string;
  initialLikes: number;
  initialLiked?: boolean; // Always false as this is from a server call with no user
  postLikes: Like[];
};

export default function LikeButton({ slug, initialLikes, initialLiked, postLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked || false);
  const { authFetch, access, user } = useAuth();

  // Check if user already liked post, client side
  // Might switch to api end point if likes per post reaches high levels
  useEffect(() => {
    if (user && postLikes.find((item) => item.user === user.id as unknown as string)) {
      setLiked(true);
    }
  }, [postLikes, user]);

  const handleLike = async () => {
    if (!user) return;

    try {
      const response = await authFetch(`${APIROOT}/api/posts/${slug}/like/`, {
        method: "POST",
      });

      if (response.ok) {
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((prev) => !prev);
      } else {
        console.error("Error liking post:", await response.json());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={!user}
      aria-label={liked ? "Remove like" : "Like this post"}
      aria-pressed={liked}
      title={!user ? "Login to like this post" : ""}
      className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-bold transition-all duration-300 shadow-sm
        ${liked 
          ? "bg-blue-600 text-white hover:bg-blue-700" 
          : !user 
            ? "bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600" 
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        }`}
    >
      <ThumbsUp size={18} className={liked ? "fill-current" : ""} />
      <span>{likes > 0 ? likes : "Like"}</span>
    </button>

  );
}
