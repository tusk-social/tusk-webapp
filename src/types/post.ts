export type PostType = "text" | "image" | "thread";

export type MediaType = "image" | "gif" | "video";

export interface MediaItem {
  url: string;
  type: MediaType;
}

export interface Post {
  id: string;
  type?: PostType;
  content?: string;
  text?: string; // Alternative field name from database
  author?: {
    name?: string;
    displayName?: string;
    username: string;
    avatarUrl?: string;
  };
  user?: {
    name?: string;
    displayName?: string;
    username: string;
    avatarUrl?: string;
    id?: string;
  };
  createdAt: Date | string;
  stats?: {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
  // Direct count fields from database
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  viewCount?: number;
  bookmarkCount?: number;

  images?: string[];
  media?: Array<string | MediaItem> | MediaItem;
  isThread?: boolean;
  threadPosts?: Omit<Post, "threadPosts">[];
  isBookmarked?: boolean;
  comments?: Post[];

  // Additional fields that might be in the database
  parentPostId?: string;
  parentPost?: Post;
  repostPostId?: string;
  repostPost?: Post;
}
