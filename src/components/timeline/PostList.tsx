"use client";

import { Post } from "@/types/post";
import PostCard from "./PostCard";
import { SAMPLE_POSTS } from "@/services/mockData";
import { memo, useMemo } from "react";

interface PostListProps {
  posts?: Post[];
}

function PostList({ posts = SAMPLE_POSTS }: PostListProps) {
  // Memoize the mapped posts to prevent unnecessary re-renders
  const postItems = useMemo(
    () => posts.map((post) => <PostCard key={post.id} post={post} />),
    [posts], // Re-compute only when posts change
  );

  return <div>{postItems}</div>;
}

export default memo(PostList);
