"use client";

import { Post } from "@/types/post";
import PostCard from "./PostCard";
import { memo, useMemo } from "react";

interface PostListProps {
  posts?: Post[];
}

function PostList({ posts = [] }: PostListProps) {
  const postItems = useMemo(
    () => posts.map((post) => <PostCard key={post.id} post={post} />),
    [posts],
  );

  return <div>{postItems}</div>;
}

export default memo(PostList);
