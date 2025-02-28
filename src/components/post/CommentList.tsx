"use client";

import { Post } from "@/types/post";
import { useState, useEffect, useCallback } from "react";
import PostCard from "../timeline/PostCard";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CommentInput from "./CommentInput";

interface CommentListProps {
  postId: string;
  initialComments?: Post[];
}

export default function CommentList({
  postId,
  initialComments = [],
}: CommentListProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Post[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/posts/${postId}/reply?page=${page}&limit=10`,
      );

      if (!response.ok) {
        throw new Error("Failed to load replies");
      }

      const data = await response.json();

      setComments((prev) =>
        page === 1 ? data.replies : [...prev, ...data.replies],
      );
      setHasMore(data.hasMore);
    } catch (error) {
      toast.error("Failed to load replies");
      console.error("Error loading replies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, page]);

  useEffect(() => {
    // Only load comments if we don't have initial comments or if we're loading more
    if (initialComments.length === 0 || page > 1) {
      loadComments();
    }
  }, [page, loadComments, initialComments.length]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSubmit = async (content: string, image: string | null) => {
    if (!content.trim() && !image) return;

    try {
      setIsSubmitting(true);

      // Create a temporary optimistic comment
      const tempComment: Post = {
        id: "temp-" + Date.now(),
        type: image ? "image" : "text",
        content: content,
        text: content,
        createdAt: new Date().toISOString(),
        user: {
          // This will be replaced with the actual user data from the API
          username: "currentuser",
          displayName: "You",
        },
        stats: {
          replies: 0,
          reposts: 0,
          likes: 0,
          views: 0,
        },
        ...(image && { images: [image] }),
      };

      // Optimistically update the UI
      setComments((prev) => [tempComment, ...prev]);

      // Send the request to the API
      const response = await fetch(`/api/posts/${postId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
          ...(image && { media: image }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      const newReply = await response.json();

      // Replace the temporary comment with the real one
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === tempComment.id ? newReply : comment,
        ),
      );

      toast.success("Reply posted successfully!");

      // Refresh the page to get the latest data
      router.refresh();
    } catch (error) {
      toast.error("Failed to post reply");
      console.error("Error posting reply:", error);

      // Remove the optimistically added comment
      setComments((prev) =>
        prev.filter((comment) => !comment.id.toString().startsWith("temp")),
      );
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

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin mr-2">⭮</div>
          <span>Loading replies...</span>
        </div>
      )}

      {/* Load More */}
      {comments.length > 0 && hasMore && !isLoading && (
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            className="text-brand hover:text-brand/90 font-medium"
          >
            Show more replies
          </button>
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  );
}
