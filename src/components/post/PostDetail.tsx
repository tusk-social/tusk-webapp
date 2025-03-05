"use client";

import { Post } from "@/types/post";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  BookMarked,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CommentList from "./CommentList";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";

interface PostDetailProps {
  post: Post;
  isGuest?: boolean;
}

function parseContent(content: string | undefined | null) {
  if (!content) return "";

  const words = content.split(/(\s+)/);

  return words.map((word, index) => {
    if (word.startsWith("#")) {
      // let's remove any non-alphanumeric characters from the end of the hashtag
      const hashtag = word.replace(/[^a-zA-Z0-9]+$/, "");

      return (
        <Link
          key={index}
          href={`/hashtag/${encodeURIComponent(hashtag.slice(1))}`}
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

export default function PostDetail({ post, isGuest = false }: PostDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.stats?.likes || post.likeCount || 0,
  );
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Try to parse media if it's a string
  let parsedMedia = post.media;
  if (typeof post.media === "string") {
    try {
      parsedMedia = JSON.parse(post.media);
      console.log("PostDetail - Parsed media from string:", parsedMedia);
    } catch (e) {
      console.error("PostDetail - Failed to parse media string:", e);
    }
  }

  const hasValidUser =
    post.user && typeof post.user === "object" && "username" in post.user;

  // Use user if available, fall back to author, then to defaults
  const userObj = hasValidUser ? post.user : null;
  const userName = userObj
    ? userObj.displayName || userObj.name || "Unknown User"
    : "Unknown User";
  const userUsername = userObj ? userObj.username : "unknown";
  const userAvatar =
    userObj && userObj.avatarUrl
      ? userObj.avatarUrl
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
    if (isGuest) {
      toast.error("Sign in to bookmark posts", {
        duration: 3000,
      });
      return;
    }

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
        {
          icon: isBookmarked ? "🗑️" : "🔖",
          duration: 2000,
        },
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark", {
        duration: 3000,
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleLike = async () => {
    if (isGuest) {
      toast.error("Sign in to like posts", {
        duration: 3000,
      });
      return;
    }

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
        {parsedMedia &&
          Array.isArray(parsedMedia) &&
          parsedMedia.length > 0 &&
          !post.images && (
            <div className="px-4">
              <div
                className={`grid gap-2 ${getImageGridClass(parsedMedia.length)}`}
              >
                {parsedMedia.map((mediaItem, index) => {
                  // Handle string or object media items
                  const mediaUrl =
                    typeof mediaItem === "string"
                      ? mediaItem
                      : mediaItem.url || "";

                  // Check if it's a GIF
                  const isGif =
                    typeof mediaItem === "object" && mediaItem.type === "gif";

                  return (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-800"
                    >
                      {isGif ? (
                        <img
                          src={mediaUrl}
                          alt={`GIF ${index + 1}`}
                          className="w-full object-cover"
                        />
                      ) : (
                        // For other media types, use Next.js Image
                        <Image
                          src={mediaUrl}
                          alt={`Post media ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Single media item handling */}
        {parsedMedia &&
          !Array.isArray(parsedMedia) &&
          typeof parsedMedia === "object" &&
          parsedMedia.url &&
          !post.images && (
            <div className="px-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
                {parsedMedia.type === "gif" ? (
                  // For GIFs, use a regular img tag instead of Next.js Image
                  <img
                    src={parsedMedia.url}
                    alt="GIF"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // For other media types (images), use Next.js Image
                  <Image
                    src={parsedMedia.url}
                    alt="Post media"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          )}

        {/* Post Meta */}
        <div className="px-4 py-3 border-y border-gray-800 mt-4 text-gray-500">
          <time>{formatDate(post.createdAt.toString())}</time>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-800 text-gray-500">
          <button
            className="flex items-center space-x-2 hover:text-brand group p-2"
            onClick={() => isGuest && toast.error("Sign in to reply to posts")}
          >
            <div className="p-2 rounded-full group-hover:bg-brand/10">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>
              {formatNumber(post.stats?.replies || post.replyCount || 0)}
            </span>
          </button>
          {/* <button className="flex items-center space-x-2 hover:text-green-500 group p-2">
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Repeat2 className="w-5 h-5" />
            </div>
            <span>
              {formatNumber(post.stats?.reposts || post.repostCount || 0)}
            </span>
          </button> */}
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
      {isGuest ? (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-xl font-bold mb-2">Join the conversation</h2>
            <p className="text-gray-400 mb-4">
              Sign in to reply to this post and join the discussion!
            </p>
            <Link
              href="/auth/login"
              className="w-full bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full font-bold text-base transition flex items-center justify-center gap-2 group"
            >
              <span>Sign in to reply</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-800">
          <CommentList postId={post.id} initialComments={post.comments || []} />
        </div>
      )}
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
