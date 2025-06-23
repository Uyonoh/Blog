import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { APIROOT, authFetch } from "../../utils/auth";
import { Topic } from "../../components/PostCard";

function CreatePost() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<string|Blob>("");
    const [topicChoices, setTopicChoices] = useState<Topic[]>([]);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        console.log("files: ", e.target.files[0]);
        setImage(e.target.files[0]);
    }
    };

    useEffect(() => {
        authFetch(APIROOT + "/api/topics", {

        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data) => {
            setTopicChoices(data);
        })
    }, []);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const values = Array.from(event.target.selectedOptions).map(
        (option) => option.value
      );
      setSelectedValues(values);
    };


    async function handlesubmit(e: React.FormEvent) {
        e.preventDefault()

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        formData.append("content", content);
        console.log("Topics: ", selectedValues);
        selectedValues.forEach( topic => {
            formData.append("topic_ids", topic);
        });

        const response = await authFetch(
            APIROOT + "/api/posts/", {
            method: "POST",
            body: formData,
            },
            "media"
        );
        if (response.ok) {
            router.push("/");
        } else {
            throw new Error("Invalid post");
        }
    }
    return(
        <section id="postForm" className="p-10">
            <form className="w-full max-w-lg" onSubmit={handlesubmit}
            encType="multipart/form-data"
            >
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
                    <div>
                    <label htmlFor="topics">Topics:</label>
                    <select name="topics" id="topics" multiple size={2}
                    onChange={handleSelect} value={selectedValues}>
                        {topicChoices.map((topic) => (
                            <option key={topic.id} value={topic.id}>{topic.name}</option>
                        ))}
                    </select>
                    <label htmlFor="cars">Choose a car:</label>
                    <select name="cars" id="cars">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                    
                    </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    
                    
      <input type="file"
      onChange={(e) => {handleFileChange(e)}}
        className="w-full text-slate-500 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
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