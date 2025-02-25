"use client";
import SplitLayout from "@/components/layouts/SplitLayout";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import CreatePost from "@/components/timeline/CreatePost";
import PostList from "@/components/timeline/PostList";
import { useState } from "react";
import { Post } from "@/types/post";

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    type: 'text',
    content: `Just launched Tusk - a modern Twitter alternative! 🚀

Built with @chopinframework and @celestia, for #Mammothon. What do you think? #webdev
`,
    author: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://api.randomx.ai/avatar/johndoe'
    },
    createdAt: '2h',
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240
    }
  },
  // ... other initial posts
];

export default function LandingPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleNewPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <SplitLayout>
      <div className="space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-brand via-purple-400 to-brand bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_15px_rgba(190,63,213,0.3)]">
          Tusk is alive.
        </h1>
        <h2 className="text-3xl font-bold text-white">
          Join today.
        </h2>
      </div>

      <div className="space-y-4">
        <button className="w-full bg-brand hover:bg-brand/90 text-white px-6 py-4 rounded-full font-medium transition"
                onClick={() => router.push("/auth/onboarding")}>
          Create account
        </button>
        <p className="text-xs text-gray-500">
          This project is a work in progress for Mammothon 2025. 
          Lots of features are missing for now and lots of things will change during the development.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-purple-800/50" />
          <span className="text-purple-400">or</span>
          <div className="flex-1 h-px bg-purple-800/50" />
        </div>
      </div>

      <div className="space-y-4">
        <button className="w-full border border-purple-800 text-brand hover:bg-brand/10 px-6 py-4 rounded-full font-medium transition">
          Restore Access
        </button>
      </div>
    </SplitLayout>
  );
}
