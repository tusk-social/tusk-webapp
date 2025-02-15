export type PostType = 'text' | 'image' | 'thread';

export interface Post {
  id: string;
  type: PostType;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
  images?: string[];
  isThread?: boolean;
  threadPosts?: Omit<Post, 'threadPosts'>[];
  isBookmarked?: boolean;
} 