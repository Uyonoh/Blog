import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

// Define Post type
type Post = {
  id: number; // or string, depending on your backend
  title: string;
  content: string;
  summary: string;
  author: string;
  created_at: string;
  updated_at: string;
  comments: Comment[];
  likes_count: number;
};

const IndexPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);  // Typing posts state
  const [error, setError] = useState<string | null>(null);  // Error state for error handling
  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/api/posts/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8 text-blue-600">Blog Posts</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}  {/* Error message */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts available.</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}        
      </div>
    </div>
  );
};

export default IndexPage;
