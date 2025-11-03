"use client";

import React, { useEffect, useState } from "react";
import { APIROOT } from "../utils/auth";
import {Post, PostCard} from "../components/PostCard";


const IndexPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);  // Typing posts state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  // Error state for error handling


  useEffect(() => {
    fetch(`${APIROOT}/api/posts/`)
      .then((res) => {
        setLoading(false);
        if (!res.ok) {
          setError("An error occured while getting the data! \
            please try again later.");
        }
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 text-blue-600">Blog Posts</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}  {/* Error message */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
