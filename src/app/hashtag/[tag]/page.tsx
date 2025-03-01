"use client";

import { use } from "react";
import AppLayout from "@/components/layout/AppLayout";
import PostList from "@/components/timeline/PostList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HashtagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export default function HashtagPage({ params }: HashtagPageProps) {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.tag);

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

        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
          <p className="text-gray-500 max-w-sm">
            Be the first to post with #{tag}
          </p>
        </div>
      </main>
    </AppLayout>
  );
}
