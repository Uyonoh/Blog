import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { APIROOT } from "@/lib/auth";
import { Post } from "@/components/PostCard";

type SearchResult = {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    likes: number;
    comments: number; 
};

export type SearchResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Post[];
};

export function useSearch(query: string) {
    const [data, setData] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const cacheRef = useRef<Map<string, SearchResponse>>(new Map());
    const { authFetch } = useAuth();

    useEffect(() => {
        if (!query || query.length < 2) {
            setData(null);
            return;
        }

        // Cache hit
        if (cacheRef.current.has(query)) {
            setData(cacheRef.current.get(query)!);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const timeout = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `${APIROOT}/api/posts/?q=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error("Search Failed");
                }

                const json: SearchResponse = await res.json();
                cacheRef.current.set(query, json);
                setData(json);
            } catch (error: unknown) {
                if ((error as any).name !== "AbortError") {
                    setError((error as any).message)
                }
            } finally {
                setLoading(false);
            }
        }, 300); //debounce

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    return { data, loading, error };
}