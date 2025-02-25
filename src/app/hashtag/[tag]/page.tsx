'use client';

import { use } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import PostList from "@/components/timeline/PostList";
import { Post } from "@/types/post";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    type: 'text',
    content: 'Exploring the latest #webdev trends! 🚀 Building with @nextjs and loving it.',
    author: {
      name: 'Tech Explorer',
      username: 'techexplorer',
      avatar: 'https://api.randomx.ai/avatar/techexplorer'
    },
    createdAt: '2h',
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240
    }
  },
  {
    id: '2',
    type: 'text',
    content: 'Just deployed my first #webdev project! Check it out at https://myproject.com',
    author: {
      name: 'Code Newbie',
      username: 'codenewbie',
      avatar: 'https://api.randomx.ai/avatar/codenewbie'
    },
    createdAt: '5h',
    stats: {
      replies: 8,
      reposts: 2,
      likes: 15,
      views: 500
    }
  }
];

interface HashtagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export default function HashtagPage({ params }: HashtagPageProps) {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.tag);
  const filteredPosts = SAMPLE_POSTS.filter(post => 
    post.content.toLowerCase().includes(`#${tag.toLowerCase()}`)
  );

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <div className="flex items-center gap-4 px-4 py-3">
            <Link href="/" className="hover:bg-white/10 p-2 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">#{tag}</h1>
              <p className="text-sm text-gray-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
            <p className="text-gray-500 max-w-sm">
              Be the first to post with #{tag}
            </p>
          </div>
        )}
      </main>
    </AppLayout>
  );
} 