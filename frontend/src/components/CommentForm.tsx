"use client";

import { useState, useEffect } from "react";

type CommentFormProps = {
  onSubmit: (author: string, content: string) => void;
};

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Example: assuming you store the username in localStorage after login
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    onSubmit(username, content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
      <label htmlFor="comment-textarea" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Leave a comment
      </label>
      <textarea
        id="comment-textarea"
        placeholder="Share your thoughts on this post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        aria-required="true"
        minLength={2}
        className="w-full min-h-[120px] p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white transition-focus focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
      />
      <button 
        type="submit" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
        disabled={!content || content.length < 2}
      >
        Post Comment
      </button>
    </form>

  );
};

export default CommentForm;
