import { APIROOT } from "../utils/auth";

export async function getPosts() {
  try {
    const response = await fetch(`${APIROOT}/api/posts/`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  } finally {
    console.info("Finished api call to /api/posts/");
  }
}

export async function getPostBySlug( slug: string ) {
  try {
    const response = await fetch(`${APIROOT}/api/posts/${slug}`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch post:", error);
    throw new Error("Failed to fetch post");
  } finally {
    console.info("Finished api call to /api/posts/...");
  }
}

export async function getPostComentsBySlug(slug: string ) {
  try {
    const response = await fetch(`${APIROOT}/api/posts/${slug}/comments/`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    return response.json();
  } catch (error: unknown) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  } finally {
    console.info("Finished api call to comments");
  }
}
