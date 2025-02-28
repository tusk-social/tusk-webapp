"use client";

import { Post } from "@/types/post";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  BookMarked,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CommentList from "./CommentList";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";

interface PostDetailProps {
  post: Post;
}

function parseContent(content: string | undefined | null) {
  if (!content) return "";

  const words = content.split(/(\s+)/);

  return words.map((word, index) => {
    if (word.startsWith("#")) {
      return (
        <Link
          key={index}
          href={`/hashtag/${encodeURIComponent(word.slice(1))}`}
          className="text-brand hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {word}
        </Link>
      );
    }
    if (word.startsWith("@")) {
      const username = word.slice(1);
      return (
        <Link
          key={index}
          href={`/${username}`}
          className="text-brand hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {word}
        </Link>
      );
    }
    return word;
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export default function PostDetail({ post }: PostDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.stats?.likes || post.likeCount || 0,
  );
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const hasValidUser =
    post.user && typeof post.user === "object" && "username" in post.user;

  // Use user if available, fall back to author, then to defaults
  const userObj = hasValidUser ? post.user : null;
  const userName = userObj
    ? userObj.displayName || userObj.name || "Unknown User"
    : "Unknown User";
  const userUsername = userObj ? userObj.username : "unknown";
  const userAvatar =
    userObj && userObj.avatar
      ? userObj.avatar
      : "https://api.randomx.ai/avatar/unknown";

  // Handle content vs text field
  const postContent = post.content || post.text || "";

  // Format the date to be human-readable
  const formatDate = (dateString: string) => {
    try {
      // Check if the date is already in a human-readable format like "2h" or "3d"
      if (/^\d+[smhdwy]$/.test(dateString)) {
        return dateString;
      }

      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if there's an error
    }
  };

  const handleBookmark = async () => {
    if (isBookmarkLoading) return;

    try {
      setIsBookmarkLoading(true);

      const endpoint = `/api/posts/${post.id}/bookmark`;
      const method = isBookmarked ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isBookmarked ? "remove bookmark" : "bookmark"} post`,
        );
      }

      // Update local state
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLikeLoading) return;

    try {
      setIsLikeLoading(true);

      const endpoint = `/api/posts/${post.id}/like`;
      const method = isLiked ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? "unlike" : "like"} post`);
      }

      // Update local state
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${userName}'s post on Tusk`,
          text: postContent,
          url: `${window.location.origin}/${userUsername}/status/${post.id}`,
        })
        .catch(console.error);
    }
  };

  return (
    <>
      <article className="pb-4">
        {/* Author Info */}
        <div className="flex items-start space-x-4 p-4 border-b border-gray-800">
          <Link
            href={`/${userUsername}`}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 relative overflow-hidden hover:opacity-90 transition"
          >
            {userAvatar && (
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
              />
            )}
          </Link>
          <div>
            <Link
              href={`/${userUsername}`}
              className="font-bold hover:underline block"
            >
              {userName}
            </Link>
            <Link
              href={`/${userUsername}`}
              className="text-gray-500 hover:underline"
            >
              @{userUsername}
            </Link>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4 text-xl whitespace-pre-wrap">
          {parseContent(postContent)}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="px-4">
            <div
              className={`grid gap-2 ${getImageGridClass(post.images.length)}`}
            >
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-800"
                >
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media handling for database structure */}
        {post.media &&
          Array.isArray(post.media) &&
          post.media.length > 0 &&
          !post.images && (
            <div className="px-4">
              <div
                className={`grid gap-2 ${getImageGridClass(post.media.length)}`}
              >
                {post.media.map((mediaItem, index) => {
                  const mediaUrl =
                    typeof mediaItem === "string"
                      ? mediaItem
                      : mediaItem.url || "";

                  return (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-800"
                    >
                      <Image
                        src={mediaUrl}
                        alt={`Post media ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Single media item handling */}
        {post.media &&
          !Array.isArray(post.media) &&
          typeof post.media === "object" &&
          post.media.url &&
          !post.images && (
            <div className="px-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
                <Image
                  src={post.media.url}
                  alt="Post media"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

        {/* Post Meta */}
        <div className="px-4 py-3 border-y border-gray-800 mt-4 text-gray-500">
          <time>{formatDate(post.createdAt)}</time>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="font-bold text-white">
                {formatNumber(post.stats?.views || post.viewCount || 0)}
              </span>
              <span className="ml-1">views</span>
            </div>
            <div>
              <span className="font-bold text-white">
                {formatNumber(post.stats?.reposts || post.repostCount || 0)}
              </span>
              <span className="ml-1">reposts</span>
            </div>
            <div>
              <span className="font-bold text-white">
                {formatNumber(post.stats?.likes || likeCount || 0)}
              </span>
              <span className="ml-1">likes</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-800 text-gray-500">
          <button className="flex items-center space-x-2 hover:text-brand group p-2">
            <div className="p-2 rounded-full group-hover:bg-brand/10">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>
              {formatNumber(post.stats?.replies || post.replyCount || 0)}
            </span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-500 group p-2">
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Repeat2 className="w-5 h-5" />
            </div>
            <span>
              {formatNumber(post.stats?.reposts || post.repostCount || 0)}
            </span>
          </button>
          <button
            className={`flex items-center space-x-2 group p-2 ${isLiked ? "text-pink-500" : "hover:text-pink-500 text-gray-500"}`}
            onClick={handleLike}
            disabled={isLikeLoading}
          >
            <div
              className={`p-2 rounded-full ${isLiked ? "bg-pink-500/10" : "group-hover:bg-pink-500/10"}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-pink-500" : ""}`} />
            </div>
            <span>{formatNumber(likeCount)}</span>
          </button>
          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={handleShare}
              className="hover:text-brand transition-colors p-2"
            >
              <Share className="w-5 h-5" />
            </button>
            <button
              onClick={handleBookmark}
              className={`hover:text-brand transition-colors p-2 ${isBookmarkLoading ? "opacity-50" : ""}`}
              disabled={isBookmarkLoading}
            >
              {isBookmarked ? (
                <BookMarked className="w-5 h-5 text-brand" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="border-t border-gray-800">
        <CommentList postId={post.id} initialComments={post.comments || []} />
      </div>
    </>
  );
}

function getImageGridClass(imageCount: number): string {
  switch (imageCount) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2";
    case 4:
      return "grid-cols-2";
    default:
      return "grid-cols-1";
  }
}
