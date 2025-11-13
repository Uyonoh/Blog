"use client";

import { useEffect } from "react";
import { getPostComentsBySlug } from "@/lib/data";

function useRefreshComments(slug: string) {
    useEffect(() => {
        async function getComments() {
            const comments = await getPostComentsBySlug(slug);
        }
    });
    
}