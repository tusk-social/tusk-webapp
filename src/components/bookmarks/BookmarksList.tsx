"use client";

import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/timeline/PostCard";
import { Post } from "@/types/post";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { toast } from "react-hot-toast";

export default function BookmarksList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { ref, inView } = useInView();

  const fetchBookmarks = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`/api/bookmarks?page=${pageNum}&limit=10`);

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const data = await response.json();

      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }

      setHasMore(data.hasMore);
      setPage(data.page);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks. Please try again later.");
      toast.error("Failed to load bookmarks");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle post unbookmark
  const handlePostUnbookmark = useCallback((postId: string) => {
    // Remove the post from the list
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    toast.success("Post removed from bookmarks");
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBookmarks(1);
  }, []);

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading && !loadingMore) {
      fetchBookmarks(page + 1, true);
    }
  }, [inView, hasMore, isLoading, loadingMore, page]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchBookmarks(1)}
          className="px-4 py-2 bg-brand rounded-full hover:bg-brand/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Save posts for later</h2>
        <p className="text-gray-500 max-w-sm">
          Bookmark posts to easily find them again in the future.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUnbookmark={handlePostUnbookmark}
        />
      ))}

      {hasMore && (
        <div ref={ref} className="flex justify-center items-center py-8">
          {loadingMore && (
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
          )}
        </div>
      )}
    </div>
  );
}
