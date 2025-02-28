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
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

function parseContent(content: string | undefined | null) {
  if (!content) return "";

  return content.split(/(\s+)/).map((part, index) => {
    if (part.startsWith("#")) {
      const tag = part.slice(1);
      return (
        <Link
          key={index}
          href={`/hashtag/${encodeURIComponent(tag)}`}
          className="text-brand hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          href={`/${username}`}
          className="text-brand hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

export default function PostCard({ post }: PostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.stats?.likes || post.likeCount || 0,
  );
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const router = useRouter();

  // Check if post has the expected structure for user/author
  const hasValidUser =
    post.user && typeof post.user === "object" && "username" in post.user;
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

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

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
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // You could add toast notification here
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleShare = () => {
    // TODO: Add share functionality
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

  const handlePostClick = () => {
    router.push(`/${userUsername}/status/${post.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

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
      // You could add toast notification here
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <article
      onClick={handlePostClick}
      className="group border-b border-gray-800 pb-4 px-4 hover:bg-white/[0.02] transition cursor-pointer relative z-[10]"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-purple-400/5 to-brand/5 blur-xl" />
      </div>

      <div className="relative z-10">
        <div className="flex space-x-4 pt-4">
          <div className="flex-shrink-0 flex flex-col">
            <Link
              href={`/${userUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-gray-800 relative overflow-hidden"
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
            {post.isThread &&
              post.threadPosts &&
              post.threadPosts.length > 0 && (
                <div className="w-0.5 bg-gray-800 mx-auto flex-1 my-2" />
              )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Link
                  href={`/${userUsername}`}
                  className="font-bold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {userName}
                </Link>
                <Link
                  href={`/${userUsername}`}
                  className="text-gray-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{userUsername}
                </Link>
              </div>
              <span className="text-gray-500 text-sm">
                {formatDate(post.createdAt.toString())}
              </span>
            </div>

            <div className="whitespace-pre-wrap mt-1">
              {parseContent(postContent)}
            </div>

            {/* Image Grid */}
            {post.images && post.images.length > 0 && (
              <div
                className={`grid gap-2 mt-3 ${getImageGridClass(post.images.length)}`}
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
            )}

            {/* Media handling for database structure */}
            {post.media &&
              Array.isArray(post.media) &&
              post.media.length > 0 &&
              !post.images && (
                <div
                  className={`grid gap-2 mt-3 ${getImageGridClass(post.media.length)}`}
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
              )}

            {/* Single media item handling */}
            {post.media &&
              !Array.isArray(post.media) &&
              typeof post.media === "object" &&
              post.media.url &&
              !post.images && (
                <div className="mt-3">
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

            {/* Thread Posts */}
            {post.isThread && post.threadPosts && (
              <div className="mt-4 space-y-4">
                {post.threadPosts.map((threadPost, index) => {
                  // Check if threadPost has valid user/author
                  const hasValidThreadUser =
                    threadPost.user &&
                    typeof threadPost.user === "object" &&
                    "username" in threadPost.user;

                  const threadUserObj = hasValidThreadUser
                    ? threadPost.user
                    : null;
                  const threadUserName = threadUserObj
                    ? threadUserObj.displayName ||
                      threadUserObj.name ||
                      "Unknown User"
                    : "Unknown User";
                  const threadUserUsername = threadUserObj
                    ? threadUserObj.username
                    : "unknown";
                  const threadUserAvatar =
                    threadUserObj && threadUserObj.avatar
                      ? threadUserObj.avatar
                      : "https://api.randomx.ai/avatar/unknown";

                  // Handle content vs text field
                  const threadPostContent =
                    threadPost.content || threadPost.text || "";

                  return (
                    <div key={index} className="relative">
                      {index < post.threadPosts!.length - 1 && (
                        <div className="absolute left-5 top-14 w-0.5 bg-gray-800 h-[calc(100%-1rem)]" />
                      )}

                      <div className="border-t border-gray-800 pt-4">
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0 flex flex-col">
                            <Link
                              href={`/${threadUserUsername}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 rounded-full bg-gray-800 relative overflow-hidden"
                            >
                              {threadUserAvatar && (
                                <Image
                                  src={threadUserAvatar}
                                  alt={threadUserName}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </Link>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between">
                              <div className="flex items-center gap-x-2">
                                <Link
                                  href={`/${threadUserUsername}`}
                                  className="font-bold hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {threadUserName}
                                </Link>
                                <Link
                                  href={`/${threadUserUsername}`}
                                  className="text-gray-500 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  @{threadUserUsername}
                                </Link>
                              </div>
                              <span className="text-gray-500 text-sm">
                                {formatDate(threadPost.createdAt.toISOString())}
                              </span>
                            </div>
                            <p className="mt-2">
                              {parseContent(threadPostContent)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between mt-4 text-gray-500 -ml-2">
              <button className="flex items-center space-x-2 hover:text-brand group p-2">
                <div className="p-2 rounded-full group-hover:bg-brand/10">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>
                  {formatNumber(post.stats?.replies || post.replyCount || 0)}
                </span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500 group p-2">
                <div className="p-2 rounded-full group-hover:bg-green-500/10">
                  <Repeat2 className="w-4 h-4" />
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
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`}
                  />
                </div>
                <span>{formatNumber(likeCount)}</span>
              </button>
              <div className="flex items-center gap-4 text-gray-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="hover:text-brand transition-colors"
                >
                  <Share className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(e);
                    }}
                    className={`hover:text-brand transition-colors ${isBookmarkLoading ? "opacity-50" : ""}`}
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
            </div>
          </div>
        </div>
      </div>
    </article>
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
      return "grid-cols-2";
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
