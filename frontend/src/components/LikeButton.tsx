"use client";

import { useEffect, useState } from "react";
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { Like } from "./PostCard";

type LikeButtonProps = {
  slug: string;
  initialLikes: number;
  postLikes: Like[];
};

export default function LikeButton({ slug, initialLikes, postLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const { authFetch, access, user } = useAuth();

  // Check if user already liked post
  useEffect(() => {
    if (user && postLikes.find((item) => item.user === user.id as unknown as string)) {
      setLiked(true);
    }
  }, [postLikes, user]);

  const handleLike = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await authFetch(`${APIROOT}/api/posts/${slug}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token || ""}`,
        },
        credentials: "include",
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
      className={`px-4 py-2 mt-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold transition ${(liked || !user) ? "bg-gray-400 hover:bg-gray-500" : "" }`}
    >
      👍 {likes > 0 ?likes : ""} 
      {/* {liked ? "Liked" : "Like"} */}
    </button>
  );
}
