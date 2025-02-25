"use client";

import Link from "next/link";
import { TRENDING_TOPICS } from "@/services/mockData";
import { memo, useMemo } from "react";

// Extract TrendingItem into a separate component
const TrendingItem = memo(
  ({
    topic,
    posts,
    hashtag,
  }: {
    topic: string;
    posts: string;
    hashtag: string;
  }) => (
    <Link
      href={`/hashtag/${hashtag.slice(1)}`}
      className="px-4 py-3 hover:bg-white/[0.03] transition block"
    >
      <div className="text-gray-500 text-sm">Trending</div>
      <div className="font-bold mt-0.5">{topic}</div>
      <div className="text-gray-500 text-sm">{posts} posts</div>
    </Link>
  ),
);

TrendingItem.displayName = "TrendingItem";

// Memoize the main component
function TrendingTopics() {
  // Memoize the mapped items to prevent unnecessary re-renders
  const trendingItems = useMemo(
    () =>
      TRENDING_TOPICS.map((item) => (
        <TrendingItem
          key={item.hashtag}
          topic={item.topic}
          posts={item.posts}
          hashtag={item.hashtag}
        />
      )),
    [], // Empty dependency array since TRENDING_TOPICS is static
  );

  return (
    <div className="border-b border-gray-800">
      <h2 className="font-bold text-xl px-4 py-3">Trends for you</h2>
      <div>{trendingItems}</div>
    </div>
  );
}

export default memo(TrendingTopics);
