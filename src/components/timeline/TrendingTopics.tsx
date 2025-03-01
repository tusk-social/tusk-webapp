"use client";

import { memo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

type TrendingHashtag = {
  hashtag: string;
  topic: string;
  posts: string;
};

// Extract TrendingItem into a separate component
const TrendingItem = memo(({ topic, posts, hashtag }: TrendingHashtag) => (
  <Link
    href={`/hashtag/${encodeURIComponent(topic)}`}
    className="block px-4 py-3 hover:bg-white/[0.03] transition cursor-pointer"
  >
    <p className="text-gray-500 text-sm">Trending</p>
    <p className="font-bold text-base">{hashtag}</p>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </Link>
));

TrendingItem.displayName = "TrendingItem";

function TrendingTopics() {
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingHashtags = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/hashtags/trending?limit=5", {
        // Add cache: 'no-store' to prevent caching issues
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

  const handleRetry = () => {
    fetchTrendingHashtags();
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl mt-4">
        <h2 className="font-bold text-xl px-4 pt-3 pb-2">
          What&apos;s happening
        </h2>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-2xl mt-4">
        <h2 className="font-bold text-xl px-4 pt-3 pb-2">
          What&apos;s happening
        </h2>
        <div className="px-4 py-6 text-gray-400 text-center">
          <p className="mb-3">Failed to load trending topics</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 mx-auto text-brand hover:underline"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (trendingHashtags.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl mt-4">
        <h2 className="font-bold text-xl px-4 pt-3 pb-2">
          What&apos;s happening
        </h2>
        <div className="px-4 py-6 text-gray-400 text-center">
          No trending topics yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">
        What&apos;s happening
      </h2>
      <div>
        {trendingHashtags.map((item) => (
          <TrendingItem
            key={item.hashtag}
            topic={item.topic}
            posts={item.posts}
            hashtag={item.hashtag}
          />
        ))}
        {trendingHashtags.length > 0 && (
          <Link
            href="/explore/trending"
            className="block w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl"
          >
            Show more
          </Link>
        )}
      </div>
    </div>
  );
}

export default memo(TrendingTopics);
