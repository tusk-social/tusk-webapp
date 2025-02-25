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
    <div
      key={hashtag}
      className="px-4 py-3 hover:bg-white/[0.03] transition cursor-pointer"
    >
      <p className="text-gray-500 text-sm">Trending</p>
      <div className="flex items-center gap-2">{topic}</div>
      <p className="font-bold text-base">{hashtag}</p>
      <p className="text-gray-500 text-sm">{posts} posts</p>
    </div>
  ),
);

TrendingItem.displayName = "TrendingItem";

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
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">
        What&apos;s happening
      </h2>
      <div>
        {trendingItems}
        <button className="w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl">
          Show more
        </button>
      </div>
    </div>
  );
}

export default memo(TrendingTopics);
