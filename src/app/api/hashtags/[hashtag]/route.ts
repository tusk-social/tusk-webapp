import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hashtag: string }> },
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get the hashtag from the URL params and decode it
    const hashtag = decodeURIComponent(resolvedParams.hashtag);

    // Get current user for bookmark status
    const user = await getCurrentUser();

    // Fetch posts with the hashtag
    const { posts, total } = await postService.getPostsByHashtag(
      hashtag,
      page,
      limit,
    );

    // Process posts to add isBookmarked flag
    const processedPosts = posts.map((post) => {
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

    return NextResponse.json({
      posts: processedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
