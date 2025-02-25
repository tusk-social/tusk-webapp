import { Post } from "@/types/post";
import PostCard from "./PostCard";

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    type: 'text',
    content: `Just launched Tusk - a modern Twitter alternative! 🚀

Built with @chopinframework and @celestia, for #Mammothon. What do you think?
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
  {
    id: '2',
    type: 'image',
    content: 'Check out these amazing photos from my trip! 📸',
    author: {
      name: 'Travel Enthusiast',
      username: 'traveler',
      avatar: 'https://api.randomx.ai/avatar/traveler'
    },
    createdAt: '4h',
    images: [
      'https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg',
      'https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg',
      'https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg',
    ],
    stats: {
      replies: 45,
      reposts: 122,
      likes: 1200,
      views: 15400
    }
  }
];

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