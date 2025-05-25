import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { APIROOT, authFetch } from "../../utils/auth";

function CreatePost() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const router = useRouter()

    async function handlesubmit(e: React.FormEvent) {
        e.preventDefault()
        const body = {
            title: title,
            content: content
        }

        const response = await authFetch(
            APIROOT + "/api/posts/", {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (response.ok) {
            router.push("/");
        } else {
            throw new Error("Invalid post");
        }
    }
    return(
        <section id="postForm" className="p-10">
            <form className="w-full max-w-lg" onSubmit={handlesubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="blog-title"
                    >
                        Blog Title
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="blog-title"
                        type="text"
                        placeholder="TITLE"
                        onChange={(e) => {setTitle(e.target.value)}}
                    />
                    <p className="text-gray-600 text-xs italic">
                        A fancy title for a viral blog
                    </p>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="blog-content"
                    >
                        Content
                    </label>
                    <textarea
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="blog-content"
                        onChange={(e) => {setContent(e.target.value)}}
                    />
                    </div>
                </div>
                <div>
                    <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Post
                    </button>
                </div>
            </form>

        </section>
    )
}

export default CreatePost;