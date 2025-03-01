"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import CreatePost from "@/components/timeline/CreatePost";
import PostList from "@/components/timeline/PostList";
import { Post } from "@/types/post";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/posts");
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to fetch posts");
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePost = (newPost: Post) => {
    // Add the new post to the beginning of the posts array
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-50 backdrop-blur-sm bg-black/90 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Home</h1>
        </div>

        <CreatePost onPost={handlePost} />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-400">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-brand hover:underline"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </main>
    </AppLayout>
  );
}
