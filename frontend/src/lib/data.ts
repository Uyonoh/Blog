import { promises } from "dns";
import { APIROOT } from "./auth";
import type { Post, Comment } from "@/components/PostCard";
import { SearchResponse } from "@/hooks/useSearch";
import { cache } from "react";

export async function getPosts(page: number): Promise<SearchResponse> {
  try {
    const response = await fetch(`${APIROOT}/api/posts/?page=${page}`, {
      cache: "no-store",
      // next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  } finally {
    console.info(`Finished API call to ${APIROOT}/api/posts/?page=${page}`);
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const response = await fetch(`${APIROOT}/api/posts/${slug}`, {
      // next: { revalidate: 60 }, // revalidate every 60 seconds
    });

    // Check content type before parsing as JSON (optional, but robust)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Received non-JSON response:", errorText);
      throw new Error("Server did not return JSON");
    }

    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch post:", error);
    throw new Error("Failed to fetch post");
  } finally {
    console.info("Finished api call to /api/posts/...");
  }
}

export async function getPostComentsBySlug(slug: string): Promise<Comment[]> {
  try {
    const response = await fetch(`${APIROOT}/api/posts/${slug}/comments/`, {
      // next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  } finally {
    console.info("Finished api call to comments");
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  const response = await fetch(`${APIROOT}/api/posts/`);
  if (!response.ok) return [];

  const res: SearchResponse = await response.json();
  const posts = res.results;
  return posts.map((post: { slug: string }) => post.slug);
}
