import { Post } from "@/types/post";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border-b border-gray-800 pb-4 px-4 hover:bg-white/[0.02] transition cursor-pointer relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-purple-400/5 to-brand/5 blur-xl" />
      </div>

      <div className="relative z-10">
        <div className="flex space-x-4 pt-4">
          <div className="flex-shrink-0 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-gray-800 relative overflow-hidden">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {post.isThread && post.threadPosts && post.threadPosts.length > 0 && (
              <div className="w-0.5 bg-gray-800 mx-auto flex-1 my-2" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Link href={`/${post.author.username}`} className="font-bold hover:underline">
                {post.author.name}
              </Link>
              <span className="text-gray-500">@{post.author.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{post.createdAt}</span>
            </div>

            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>

            {/* Image Grid */}
            {post.images && post.images.length > 0 && (
              <div className={`grid gap-2 mt-3 ${getImageGridClass(post.images.length)}`}>
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

            {/* Thread Posts */}
            {post.isThread && post.threadPosts && (
              <div className="mt-4 space-y-4">
                {post.threadPosts.map((threadPost, index) => (
                  <div key={index} className="relative">
                    {index < post.threadPosts!.length - 1 && (
                      <div className="absolute left-5 top-14 w-0.5 bg-gray-800 h-[calc(100%-1rem)]" />
                    )}
                    
                    <div className="border-t border-gray-800 pt-4">
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-800 relative overflow-hidden flex-shrink-0">
                          {threadPost.author.avatar && (
                            <Image
                              src={threadPost.author.avatar}
                              alt={threadPost.author.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{threadPost.author.name}</span>
                            <span className="text-gray-500">@{threadPost.author.username}</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">{threadPost.createdAt}</span>
                          </div>
                          <p className="mt-2">{threadPost.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between mt-4 text-gray-500 -ml-2">
              <button className="flex items-center space-x-2 hover:text-brand group p-2">
                <div className="p-2 rounded-full group-hover:bg-brand/10">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>{formatNumber(post.stats.replies)}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500 group p-2">
                <div className="p-2 rounded-full group-hover:bg-green-500/10">
                  <Repeat2 className="w-4 h-4" />
                </div>
                <span>{formatNumber(post.stats.reposts)}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-pink-500 group p-2">
                <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                  <Heart className="w-4 h-4" />
                </div>
                <span>{formatNumber(post.stats.likes)}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-brand group p-2">
                <div className="p-2 rounded-full group-hover:bg-brand/10">
                  <Share className="w-4 h-4" />
                </div>
                <span>{formatNumber(post.stats.views)}</span>
              </button>
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
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-2';
    case 4:
      return 'grid-cols-2';
    default:
      return 'grid-cols-2';
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
} 