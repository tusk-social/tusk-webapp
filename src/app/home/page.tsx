"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isPolling, setIsPolling] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const latestPostIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch posts from the API
  const fetchPosts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
        setError(null);
      }

      const response = await fetch("/api/posts?exclude_replies=true");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      return data.posts || [];
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
      toast.error("Failed to load posts. Please try again later.");
      return [];
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    const loadInitialPosts = async () => {
      const initialPosts = await fetchPosts();
      setPosts(initialPosts);

      // Store the ID of the most recent post for polling comparison
      if (initialPosts.length > 0) {
        latestPostIdRef.current = initialPosts[0].id;
      }
    };

    loadInitialPosts();
  }, []);

  // Setup polling for new posts
  useEffect(() => {
    const pollForNewPosts = async () => {
      setIsPolling(true);
      try {
        const latestPosts = await fetchPosts(false);

        if (latestPosts.length > 0 && latestPostIdRef.current) {
          // Find new posts (posts that appeared after our latest known post)
          const newPosts = latestPosts.filter((post: Post) => {
            // Skip if it's a reply
            if (post.parentPostId) return false;

            // Check if this post is newer than our latest known post
            const isNewer =
              post.id !== latestPostIdRef.current &&
              !posts.some((existingPost) => existingPost.id === post.id);

            return isNewer;
          });

          if (newPosts.length > 0) {
            setNewPostsCount((prevCount) => prevCount + newPosts.length);
            // Update the latest post ID reference
            latestPostIdRef.current = latestPosts[0].id;
          }
        }
      } catch (error) {
        console.error("Error polling for new posts:", error);
      } finally {
        setIsPolling(false);
      }
    };

    // Set up polling interval (15 seconds)
    pollingIntervalRef.current = setInterval(pollForNewPosts, 15000);

    // Clean up interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [posts]);

  // Function to load new posts when the user clicks the notification
  const loadNewPosts = async () => {
    const newPosts = await fetchPosts(false);
    setPosts(newPosts);
    setNewPostsCount(0);

    // Update latest post ID reference
    if (newPosts.length > 0) {
      latestPostIdRef.current = newPosts[0].id;
    }
  };

  const handlePost = (newPost: Post) => {
    if (!newPost.parentPostId) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      // Update latest post ID reference when user creates a new post
      latestPostIdRef.current = newPost.id;
    }
  };

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-50 backdrop-blur-sm bg-black/90 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Home</h1>
        </div>

        <CreatePost onPost={handlePost} />

        {newPostsCount > 0 && (
          <button
            onClick={loadNewPosts}
            className="w-full py-2.5 text-brand hover:bg-gray-900/50 transition-colors border-b border-gray-800 font-medium text-sm"
          >
            Show {newPostsCount} new {newPostsCount === 1 ? "post" : "posts"}
          </button>
        )}

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
