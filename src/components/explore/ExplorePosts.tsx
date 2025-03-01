"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/timeline/PostCard";
import { Post } from "@/types/post";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ExplorePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/posts/popular?limit=10", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch popular posts");
      }

      const data = await response.json();

      if (!data.posts) {
        throw new Error("Invalid response format");
      }

      setPosts(data.posts || []);
    } catch (err: any) {
      console.error("Error fetching popular posts:", err);
      setError(err.message || "Failed to fetch popular posts");
      toast.error("Failed to load popular posts", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="mb-3">Failed to load popular posts</p>
        <button
          onClick={fetchPopularPosts}
          className="flex items-center gap-2 mx-auto text-brand hover:underline"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No popular posts yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-xl px-4 py-3 border-b border-gray-800">
        Popular Posts
      </h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
