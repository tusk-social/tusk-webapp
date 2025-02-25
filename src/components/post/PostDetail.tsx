'use client';

import { Post } from "@/types/post";
import { Heart, MessageCircle, Repeat2, Share, Bookmark, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CommentList from "./CommentList";

interface PostDetailProps {
  post: Post;
}

function parseContent(content: string) {
  const words = content.split(/(\s+)/);
  
  return words.map((word, index) => {
    if (word.startsWith('#')) {
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
    if (word.startsWith('@')) {
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

  const handleBookmark = () => {
    // TODO: Add API call to toggle bookmark
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.author.name}'s post on Tusk`,
        text: post.content,
        url: `${window.location.origin}/${post.author.username}/status/${post.id}`,
      }).catch(console.error);
    }
  };

  return (
    <>
      <article className="pb-4">
        {/* Author Info */}
        <div className="flex items-start space-x-4 p-4 border-b border-gray-800">
          <Link
            href={`/${post.author.username}`}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 relative overflow-hidden hover:opacity-90 transition"
          >
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            )}
          </Link>
          <div>
            <Link 
              href={`/${post.author.username}`}
              className="font-bold hover:underline block"
            >
              {post.author.name}
            </Link>
            <Link 
              href={`/${post.author.username}`}
              className="text-gray-500 hover:underline"
            >
              @{post.author.username}
            </Link>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4 text-xl whitespace-pre-wrap">
          {parseContent(post.content)}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="px-4">
            <div className={`grid gap-2 ${getImageGridClass(post.images.length)}`}>
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

        {/* Post Meta */}
        <div className="px-4 py-3 border-y border-gray-800 mt-4 text-gray-500">
          <time>{post.createdAt}</time>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="font-bold text-white">{formatNumber(post.stats.views)}</span>
              <span className="ml-1">views</span>
            </div>
            <div>
              <span className="font-bold text-white">{formatNumber(post.stats.reposts)}</span>
              <span className="ml-1">reposts</span>
            </div>
            <div>
              <span className="font-bold text-white">{formatNumber(post.stats.likes)}</span>
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
            <span>{formatNumber(post.stats.replies)}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-500 group p-2">
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Repeat2 className="w-5 h-5" />
            </div>
            <span>{formatNumber(post.stats.reposts)}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-pink-500 group p-2">
            <div className="p-2 rounded-full group-hover:bg-pink-500/10">
              <Heart className="w-5 h-5" />
            </div>
            <span>{formatNumber(post.stats.likes)}</span>
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
              className="hover:text-brand transition-colors p-2"
            >
              {isBookmarked ? (
                <BookMarked className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </article>
      
      {/* Comments Section */}
      <div className="border-t border-gray-800">
        <CommentList postId={post.id} initialComments={post.comments} />
      </div>
    </>
  );
}

function getImageGridClass(imageCount: number): string {
  switch (imageCount) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-2';
    case 4:
      return 'grid-cols-2';
    default:
      return 'grid-cols-1';
  }
} 