import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { APIROOT, authFetch } from "../../utils/auth";
import CommentForm from "../../components/CommentForm";
import LikeButton from "../../components/LikeButton";

// Define types for Post and Comment
type Comment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
};

type Like = {
  id: number;
  user: string;
};

type Post = {
  id: number;       // or string, depending on your backend
  slug: string;
  title: string;
  image: string;
  summary: string;
  content: string;
  author: string;
  created_at: string;
  likes: Like[];
  likes_count: number;
  liked_by_user: boolean;
};

const PostDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(false);


  useEffect(() => {
    if (slug) {
      // Fetch the post details
      fetch(`${APIROOT}/api/posts/${slug}`)
        .then((response) => response.json())
        .then((data: Post) => {
          setPost(data);
          const username = localStorage.getItem("username");
          if (username && data.likes.find( item => item.user === username)) {
            setLiked(true);
          }else {
            console.log(data.likes)
          }
          // console.log(username);  
          setLoading(false);
        })
        .catch(() => setError("Failed to load post."));

      // Fetch the comments for the post
      fetch(`${APIROOT}/api/posts/${slug}/comments/`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch(() => {
          setError("Failed to load comments.");
        });
    }
  }, [slug]);


  const handleCommentSubmit = async (author: string, content: string) => {
    try {
      const response = await authFetch(`${APIROOT}/api/posts/${slug}/comments/`, {
        method: "POST",
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
 

  if (loading) return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!post) return <div className="text-center mt-10 text-red-500">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
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

      {/* Post Title and Content */}
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
        {post.title}
      </h1>
      <div>
        <img src={post.image} alt="Blog post Image"/>
      </div>
      <article className="prose prose-lg prose-gray dark:prose-invert mt-6">
        {post.content}
      </article>

      <hr className="my-10 border-gray-300 dark:border-gray-700" />

      <LikeButton
        slug={post.slug}
        initialLikes={post.likes_count}
        initialLiked={liked}
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
  );
};

export default PostDetail;
