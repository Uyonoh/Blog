import { useState } from "react";
import {APIROOT, authFetch} from "../utils/auth";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
  initialLiked: boolean;
};

export default function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  console.log("Like" + liked);

  const handleLike = async () => {
    try {
      const response = await authFetch(`${APIROOT}/api/posts/${postId}/like/`, {
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
      className={`px-4 py-2 mt-4 rounded ${
        liked ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
      } text-white font-bold transition`}
    >
      👍 {likes} {liked ? "Liked" : "Like"}
    </button>
  );
}
