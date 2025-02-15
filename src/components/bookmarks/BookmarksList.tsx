'use client';

import { Post } from "@/types/post";
import PostCard from "@/components/timeline/PostCard";

const SAMPLE_BOOKMARKS: Post[] = [
  {
    id: '1',
    type: 'text',
    content: 'This is a bookmarked post about #coding and #webdev!',
    author: {
      name: 'Tech Enthusiast',
      username: 'techlover',
      avatar: '/avatars/tech.jpg'
    },
    createdAt: '2h',
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240
    },
    isBookmarked: true
  },
  {
    id: '2',
    type: 'image',
    content: 'Saved this amazing design inspiration for later! 🎨',
    author: {
      name: 'Design Master',
      username: 'designpro',
      avatar: '/avatars/designer.jpg'
    },
    createdAt: '5h',
    images: ['/posts/design1.jpg'],
    stats: {
      replies: 8,
      reposts: 15,
      likes: 122,
      views: 1800
    },
    isBookmarked: true
  }
];

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