'use client';

import PostCard from "@/components/timeline/PostCard";
import { SAMPLE_BOOKMARKS } from "@/services/mockData";

export default function BookmarksList() {
  if (SAMPLE_BOOKMARKS.length === 0) {
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
      {SAMPLE_BOOKMARKS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 