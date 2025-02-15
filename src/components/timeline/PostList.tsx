import { Post } from "@/types/post";
import PostCard from "./PostCard";

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    type: 'text',
    content: 'Just a regular text post. #Tusk',
    author: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: '/avatars/john.jpg'
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
      avatar: '/avatars/traveler.jpg'
    },
    createdAt: '4h',
    images: [
      '/posts/trip1.jpg',
      '/posts/trip2.jpg',
      '/posts/trip3.jpg',
      '/posts/trip4.jpg'
    ],
    stats: {
      replies: 45,
      reposts: 122,
      likes: 1200,
      views: 15400
    }
  },
  {
    id: '3',
    type: 'thread',
    content: '1/ Starting a thread about building great products...',
    author: {
      name: 'Product Guru',
      username: 'prodguru',
      avatar: '/avatars/guru.jpg'
    },
    createdAt: '5h',
    isThread: true,
    threadPosts: [
      {
        id: '3.1',
        type: 'text',
        content: '2/ First, always start with the user problem. What are they trying to solve?',
        author: {
          name: 'Product Guru',
          username: 'prodguru',
          avatar: '/avatars/guru.jpg'
        },
        createdAt: '5h',
        stats: {
          replies: 8,
          reposts: 15,
          likes: 45,
          views: 850
        }
      },
      {
        id: '3.2',
        type: 'text',
        content: '3/ Then, focus on the simplest solution that could work. MVP is key.',
        author: {
          name: 'Product Guru',
          username: 'prodguru',
          avatar: '/avatars/guru.jpg'
        },
        createdAt: '5h',
        stats: {
          replies: 5,
          reposts: 12,
          likes: 38,
          views: 720
        }
      }
    ],
    stats: {
      replies: 25,
      reposts: 48,
      likes: 156,
      views: 2800
    }
  }
];

export default function PostList() {
  return (
    <div>
      {SAMPLE_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 