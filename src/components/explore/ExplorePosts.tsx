"use client";

import { Post } from "@/types/post";
import PostCard from "@/components/timeline/PostCard";
import { EXPLORE_POSTS } from "@/services/mockData";

export default function ExplorePosts() {
  return (
    <div>
      {EXPLORE_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
