"use client";

import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

type TrendingHashtag = {
  hashtag: string;
  topic: string;
  posts: string;
};

export default function TrendingPage() {
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingHashtags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/hashtags/trending?limit=20", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trending hashtags");
      }

      const data = await response.json();

      if (!data.trendingHashtags) {
        throw new Error("Invalid response format");
      }

      setTrendingHashtags(data.trendingHashtags || []);
    } catch (err: any) {
      console.error("Error fetching trending hashtags:", err);
      setError(err.message || "Failed to fetch trending hashtags");
      toast.error("Failed to load trending topics", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingHashtags();
  }, [fetchTrendingHashtags]);

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
              <h1 className="text-xl font-bold">Trending</h1>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-400">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchTrendingHashtags}
              className="flex items-center gap-2 mx-auto text-brand hover:underline"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        ) : trendingHashtags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-2xl font-bold mb-2">No trending topics</h2>
            <p className="text-gray-500 max-w-sm">
              Check back later for trending hashtags
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {trendingHashtags.map((item) => (
              <Link
                key={item.hashtag}
                href={`/hashtag/${encodeURIComponent(item.topic)}`}
                className="block px-4 py-4 hover:bg-white/[0.03] transition"
              >
                <p className="text-gray-500 text-sm">Trending</p>
                <p className="font-bold text-lg">{item.hashtag}</p>
                <p className="text-gray-500 text-sm">{item.posts} posts</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
