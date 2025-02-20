"use client";

import { Post } from "@/types/post";
import PostCard from "@/components/timeline/PostCard";

const EXPLORE_POSTS: Post[] = [
  {
    id: "1",
    type: "text",
    content: "Exciting developments in #AI and #MachineLearning! 🤖",
    author: {
      name: "Tech Explorer",
      username: "techexplorer",
      avatar: "/avatars/tech.jpg",
    },
    createdAt: "2h",
    stats: {
      replies: 45,
      reposts: 120,
      likes: 850,
      views: 12400,
    },
  },
  {
    id: "2",
    type: "image",
    content:
      "The future of web development is here! Check out these amazing tools 🚀 #webdev #coding",
    author: {
      name: "Web Wizard",
      username: "webwizard",
      avatar: "/avatars/wizard.jpg",
    },
    createdAt: "5h",
    images: ["/posts/webdev.jpg"],
    stats: {
      replies: 28,
      reposts: 75,
      likes: 420,
      views: 8900,
    },
  },
];

export default function ExplorePosts() {
  return (
    <div>
      {EXPLORE_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
