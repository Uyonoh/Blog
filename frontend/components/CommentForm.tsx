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
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <textarea
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 mb-2 w-full rounded dark:bg-gray-900 dark:text-white"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full">
        Submit Comment
      </button>
    </form>
  );
};

export default CommentForm;
