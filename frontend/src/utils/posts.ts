import { Post } from "../components/PostCard";

export const posts: Post[] = [
  {
    id: 1,     // or string, depending on your backend
    slug: "tthemeingNone",
    title: "Post 1",
    image: "/images/react.png",
    summary: "post summry",
    content: "content",
    author: "mobius",
    created_at: "2024-12-12",
    likes_count: 5,
    liked_by_user: true,
    html_content: "content",
    likes: [],
    comments: [],
    topics: [],
  },
  {
    id: 2,     // or string, depending on your backend
    slug: "post-2",
    title: "Post 2",
    image: "/images/react2.png",
    summary: "post22 summry",
    content: "content",
    author: "mobius",
    created_at: "2024-10-10",
    likes_count: 3,
    liked_by_user: false,
    html_content: "content 22",
    likes: [],
    comments: [],
    topics: [],
  },
];

export const getPostBySlug = (slug: string): Post | undefined =>
    posts.find((post) => post.slug === slug);


export const getAllSlugs = (): string[] =>
    posts.map((post) => post.slug);