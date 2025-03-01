import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { Post, User } from "@prisma/client";

// Define types for the post with includes
type PostWithIncludes = Post & {
  user: User;
  _count: {
    likes: number;
    replies: number; // Based on schema, Post has replyCount not comments
  };
  likes: any[];
  postHashtags: {
    hashtag: {
      hashtag: string;
    };
  }[];
};

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    // If query is empty, return empty array
    if (!query) {
      return NextResponse.json({ posts: [] });
    }

    // Get current user for like status
    const currentUser = await getCurrentUser();

    // Search for posts matching the query
    const posts = (await prisma.post.findMany({
      where: {
        OR: [
          { text: { contains: query, mode: "insensitive" } },
          {
            postHashtags: {
              some: {
                hashtag: {
                  hashtag: { contains: query, mode: "insensitive" },
                },
              },
            },
          },
          {
            user: {
              OR: [
                { username: { contains: query, mode: "insensitive" } },
                { displayName: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        ],
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true, // Use replies instead of comments
          },
        },
        likes: currentUser
          ? {
              where: {
                userId: currentUser.id,
              },
            }
          : undefined,
        postHashtags: {
          select: {
            hashtag: {
              select: {
                hashtag: true,
              },
            },
          },
        },
      },
    })) as unknown as PostWithIncludes[];

    // Format posts for the response
    const formattedPosts = posts.map((post: PostWithIncludes) => {
      // Parse media from JSON
      const media =
        typeof post.media === "string"
          ? JSON.parse(post.media)
          : post.media || [];

      // Extract hashtags
      const hashtags = post.postHashtags.map((h) => h.hashtag.hashtag);

      return {
        id: post.id,
        content: post.text,
        media,
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          username: post.user.username,
          displayName: post.user.displayName,
          avatar:
            post.user.avatarUrl ||
            `https://api.randomx.ai/avatar/${post.user.username}`,
        },
        stats: {
          likes: post._count.likes,
          comments: post._count.replies, // Map replies to comments in the response
        },
        isLiked: currentUser ? post.likes && post.likes.length > 0 : false,
        hashtags,
      };
    });

    return NextResponse.json({ posts: formattedPosts });
  } catch (error: any) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      {
        error: "Failed to search posts",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
