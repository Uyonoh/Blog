// import { useState, useEffect } from 'react';
// import LikeButton from '../../components/LikeButton';
// import CommentForm from '../../components/CommentForm';

// // Define types for Post and Comment
// type Post = {
//   id: number;       // or string, depending on your backend
//   title: string;
//   content: string;
// };

// type Comment = {
//   id: number;       // or string
//   author: string;
//   content: string;
// };

// type PostDetailProps = {
//   post: Post;
// };

// export default function PostDetail({ post }: PostDetailProps) {
//   const [comments, setComments] = useState<Comment[]>([]);  // Typing comments state
//   const apiUrl = 'http://localhost:8000';

//   useEffect(() => {
//     // Fetch comments for the post (to be implemented in the backend)
//     fetch(`${apiUrl}/api/posts/${post.id}/comments/`)
//       .then((response) => response.json())
//       .then((data) => setComments(data));
//   }, [post.id]);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold">{post.title}</h1>
//       <p className="mt-4">{post.content}</p>
//       <LikeButton postId={post.id} />
//       <h2 className="text-xl mt-8">Comments</h2>
//       <div>
//         {comments.map((comment) => (
//           <div key={comment.id} className="border-b py-4">
//             <p className="font-semibold">{comment.author}</p>
//             <p>{comment.content}</p>
//           </div>
//         ))}
//       </div>
//       <CommentForm postId={post.id} />
//     </div>
//   );
// }
