"use client";

import { useEffect, useState } from "react";
import {APIROOT, authFetch} from "../utils/auth";
import { Like } from "./PostCard";

type LikeButtonProps = {
  slug: string;
  initialLikes: number;
  postLikes: Like[];
};

// Refresh on auth state change
export default function LikeButton({ slug: slug, initialLikes, postLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const user = localStorage.getItem("user");
  console.log("Like" + liked);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && postLikes.find((item) => item.user == user)) {
      setLiked(true);
    } else {
      console.log("likes: ", postLikes);
      console.log("USer:", user);
    }
  }, [postLikes]);

  const handleLike = async () => {
    try {
      const response = await authFetch(`${APIROOT}/api/posts/${slug}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("access_token") || ""}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((liked) => !liked);
      } else {
        const data = await response.json();
        console.error("Error liking post:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || !user}
      // className={`px-4 py-2 mt-4 rounded ${
      //   liked ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
      // } text-white font-bold transition`}
      className="px-4 py-2 mt-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold transition disabled:bg-gray-400"
    >
      👍 {likes} {liked ? "Liked" : "Like"}
    </button>
  );
}
