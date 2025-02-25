import { Post } from "@/types/post";

interface FetchCommentsResponse {
  comments: Post[];
  hasMore: boolean;
  total: number;
}

export async function fetchComments(postId: string, page = 1, limit = 20): Promise<FetchCommentsResponse> {
  const response = await fetch(
    `/api/posts/${postId}/comments?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

export async function createComment(postId: string, content: string, image: string | null = null): Promise<Post> {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, image }),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
}

// Helper function to format relative time
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  return past.toLocaleDateString();
} 