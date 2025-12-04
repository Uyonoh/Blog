"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Head from 'next/head';
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import {Post, Comment} from "@/components/PostCard";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { getPostBySlug, getPostComentsBySlug } from "@/lib/data";
import Prism from 'prismjs';
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/navigation";

// Styles
import "@/styles/posts.css";


type Props = {
  post: Post;
  postComments: Comment[];
};

export default function PostDetail({ post, postComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(postComments);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { authFetch, user } = useAuth();

  const dev = !!process.env.NEXT_PUBLIC_DEV; // wrap with conditional (?? false etc)
  console.log("Dev:", dev);

  useEffect(() => {
    setTimeout(() => {
      Prism.highlightAll();
      console.log("URL:", post.image);
    }, 500);

  }, []);

  function useRefreshComments(slug: string) {
    useEffect(() => {
        async function getSetComments() {
            const comments = await getPostComentsBySlug(slug);
            setComments(comments);
        }

        // Wont run on mount, only after interval
        const intervalId = setInterval(getSetComments, 1 * 60 * 1000); // Check comments every 1 min

        return () => clearInterval(intervalId);
    }, []);
  }

  useRefreshComments(post.slug);


  const handleCommentSubmit = async (author: string, content: string) => {
    const fetchProtocol = user ? authFetch : fetch;
    try {
      const response = await fetchProtocol(`${APIROOT}/api/posts/${post?.slug}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        console.log(response.text);
        throw new Error("Too many requests. Please wait a moment.");
      }

      const newComment: Comment = await response.json();
      setComments([newComment, ...comments]); // Add new comment at the top
   } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error('Unexpected error', error);
      }
    }
  }
 

  // if (loading) return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!post) return <div className="text-center mt-10 text-red-500">Post not found.</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Author and Post Meta */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div>
            <p className="text-gray-800 dark:text-white font-semibold">
              {post.author}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toDateString()}
            </p>
          </div>
        </div>

        {/* Topic tags */}
        <div className="max-w px-1">
          {post.topics.map((topic, index) => {
            return (
              <span key={index} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-md mr-2">
                {topic.name}
              </span>
            );
          })}
        </div>

        {/* Post Title and Content */}
        <h1 className="text-2xl lg:text-3xl pt-5 font-bold text-gray-900 dark:text-gray-200 leading-tight">
          {post.title}
        </h1>
        <div className="pt-5 pb-10">
          {/* <img src={post.image} alt="Blog post Image"/> */}
          <Image
            src={post.image}
            alt="Blog post Image"
            width={500}
            height={500}
            unoptimized={dev}
          />
          {/* Subtitle here */}
        </div>
        {/* <article className="prose prose-lg prose-gray dark:prose-invert mt-6">
          {post.content}
        </article> */}
        {/* Render the HTML content using dangerouslySetInnerHTML */}
        {/* Apply the 'prose' class for beautiful default styling */}
        {post.html_content && <SyntaxHighlighter htmlContent={post.html_content} />}

        <hr className="my-10 border-gray-300 dark:border-gray-700" />

        <LikeButton
          slug={post.slug}
          initialLikes={post.likes_count}
          postLikes={post.likes}
        />

        <hr className="my-10 border-gray-300 dark:border-gray-700" />

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Comments
          </h2>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Comment Form */}
          <CommentForm onSubmit={handleCommentSubmit} />

          {/* Comment List */}
          <div className="mt-6 space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }