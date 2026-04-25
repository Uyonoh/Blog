"use client";

import React, { useState, useEffect } from "react";
import { APIROOT } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import { Comment } from "@/components/PostCard";
import { getPostComentsBySlug } from "@/lib/data";

type CommentSectionProps = {
  slug: string;
  initialComments: Comment[];
  initialLikes: number;
  postLikes: any[]; // Adjust type as needed
};

export default function CommentSection({
  slug,
  initialComments,
  initialLikes,
  postLikes,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string>("");
  const { authFetch, user } = useAuth();

  useEffect(() => {
    async function refreshComments() {
      try {
        const freshComments = await getPostComentsBySlug(slug);
        setComments(freshComments);
      } catch (err) {
        console.error("Failed to refresh comments:", err);
      }
    }

    const intervalId = setInterval(refreshComments, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [slug]);

  const handleCommentSubmit = async (author: string, content: string) => {
    const fetchProtocol = user ? authFetch : fetch;
    try {
      const response = await fetchProtocol(`${APIROOT}/api/posts/${slug}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Too many requests. Please wait a moment.");
      }

      const newComment: Comment = await response.json();
      setComments([newComment, ...comments]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error('Unexpected error', error);
      }
    }
  };

  return (
    <section className="mt-12 space-y-8" aria-labelledby="comments-heading">
      <LikeButton
        slug={slug}
        initialLikes={initialLikes}
        postLikes={postLikes}
      />

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div>
        <h2 id="comments-heading" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Comments ({comments.length})
        </h2>

        {error && (
          <div role="alert" className="p-4 mb-6 text-sm text-red-800 bg-red-50 dark:bg-zinc-800 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <CommentForm onSubmit={handleCommentSubmit} />

        <div className="mt-10 space-y-6">
          {comments.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                <header className="flex justify-between items-center mb-3">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {comment.author}
                  </span>
                  <time dateTime={comment.created_at} className="text-sm text-zinc-500">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </header>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
