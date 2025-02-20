"use client";

import Link from "next/link";

const TRENDING_TOPICS = [
  {
    topic: "Technology",
    posts: "125.4K",
    hashtag: "#tech",
  },
  {
    topic: "Web Development",
    posts: "85.2K",
    hashtag: "#webdev",
  },
  {
    topic: "Artificial Intelligence",
    posts: "92.1K",
    hashtag: "#AI",
  },
  {
    topic: "Open Source",
    posts: "45.6K",
    hashtag: "#opensource",
  },
];

export default function TrendingTopics() {
  return (
    <div className="border-b border-gray-800">
      <h2 className="font-bold text-xl px-4 py-3">Trends for you</h2>
      <div>
        {TRENDING_TOPICS.map((item) => (
          <Link
            key={item.hashtag}
            href={`/hashtag/${item.hashtag.slice(1)}`}
            className="px-4 py-3 hover:bg-white/[0.03] transition block"
          >
            <div className="text-gray-500 text-sm">Trending</div>
            <div className="font-bold mt-0.5">{item.topic}</div>
            <div className="text-gray-500 text-sm">{item.posts} posts</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
