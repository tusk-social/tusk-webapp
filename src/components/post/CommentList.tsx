'use client';

import { Post } from "@/types/post";
import { useState, useEffect, useCallback } from "react";
import PostCard from "../timeline/PostCard";
import { createComment, fetchComments } from "@/services/comments";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CommentInput from "./CommentInput";

interface CommentListProps {
  postId: string;
  initialComments?: Post[];
}

export default function CommentList({ postId, initialComments = [] }: CommentListProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Post[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchComments(postId, page);
      
      setComments(prev => 
        page === 1 ? response.comments : [...prev, ...response.comments]
      );
      setHasMore(response.hasMore);
    } catch (error) {
      toast.error('Failed to load comments');
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, page]);

  useEffect(() => {
    if (page > 1) {
      loadComments();
    }
  }, [page, loadComments]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleSubmit = async (content: string, image: string | null) => {
    try {
      setIsSubmitting(true);
      const newComment = await createComment(postId, content);
      
      // Optimistically update the UI
      setComments(prev => [newComment, ...prev]);
      
      // Refresh the page to get the latest data
      router.refresh();
      
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error('Failed to post comment');
      console.error('Error posting comment:', error);
      
      // Remove the optimistically added comment
      setComments(prev => prev.filter(comment => comment.id !== 'temp'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="divide-y divide-gray-800">
      {/* Comment Input */}
      <CommentInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {/* Comments List */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-800">
            <PostCard post={comment} />
          </div>
        ))}
      </div>

      {/* Load More */}
      {comments.length > 0 && hasMore && (
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-brand hover:text-brand/90 font-medium disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Show more replies'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>No comments yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  );
} 