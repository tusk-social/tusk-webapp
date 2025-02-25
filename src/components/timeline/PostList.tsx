import { Post } from "@/types/post";
import PostCard from "./PostCard";
import { SAMPLE_POSTS } from "@/services/mockData";

interface PostListProps {
  posts?: Post[];
}

export default function PostList({ posts = SAMPLE_POSTS }: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 