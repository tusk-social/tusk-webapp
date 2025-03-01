import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { prisma } from "@/lib/db";
import { postService } from "@/services/postService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get current user for bookmark and like status
    const user = await getCurrentUser();

    // Fetch posts with the most likes
    const popularPosts = await prisma.post.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        likeCount: "desc",
      },
      take: limit,
      include: {
        user: true,
        parentPost: {
          include: {
            user: true,
          },
        },
        repostPost: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: true,
        mentions: {
          include: {
            mentionedUser: true,
          },
        },
        postHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    // Process posts to add isBookmarked flag and parse media
    const processedPosts = popularPosts.map((post) => {
      // Parse media in the post
      const parsedPost = postService.parsePostMedia(post);

      // Check if the post is bookmarked by the current user
      const isBookmarked = user
        ? parsedPost.bookmarks.some(
            (bookmark: any) => bookmark.userId === user.id,
          )
        : false;

      // Check if the post is liked by the current user
      const isLiked = user
        ? parsedPost.likes.some((like: any) => like.userId === user.id)
        : false;

      return {
        ...parsedPost,
        isBookmarked,
        isLiked,
      };
    });

    return NextResponse.json({ posts: processedPosts });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular posts", posts: [] },
      { status: 500 },
    );
  }
}
