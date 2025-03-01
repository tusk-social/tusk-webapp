"use client";

import { use, useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import PostList from "@/components/timeline/PostList";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Post } from "@/types/post";
import { toast } from "react-hot-toast";

interface HashtagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export default function HashtagPage({ params }: HashtagPageProps) {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.tag);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch posts with the hashtag
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/hashtags/${encodeURIComponent(tag)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setHasMore(data.pagination?.pages > 1);
      } catch (err: any) {
        console.error("Error fetching hashtag posts:", err);
        setError(err.message || "Failed to fetch posts");
        toast.error("Failed to load posts. Please try again later.", {
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  // Load more posts
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const response = await fetch(
        `/api/hashtags/${encodeURIComponent(tag)}?page=${nextPage}&limit=20`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();
      const newPosts = data.posts || [];

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage(nextPage);
        setHasMore(data.pagination?.pages > nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Error fetching more posts:", err);
      toast.error("Failed to load more posts. Please try again.", {
        duration: 3000,
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <div className="flex items-center gap-4 px-4 py-3">
            <Link
              href="/"
              className="hover:bg-white/10 p-2 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">#{tag}</h1>
            </div>
          </div>
        </div>

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
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
            <p className="text-gray-500 max-w-sm">
              Be the first to post with #{tag}
            </p>
          </div>
        ) : (
          <>
            <PostList posts={posts} />

            {hasMore && (
              <div className="py-4 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="px-4 py-2 text-brand hover:bg-gray-900/50 rounded-full transition disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
