import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, media, parentPostId, repostPostId } = await request.json();

    if (!text && !repostPostId) {
      return NextResponse.json(
        { error: "Post must contain text or be a repost" },
        { status: 400 },
      );
    }

    const post = await postService.createPost({
      userId: user.id,
      text: text || "",
      media,
      parentPostId,
      repostPostId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = (searchParams.get("type") || "all") as
      | "all"
      | "replies"
      | "media";
    const excludeReplies = searchParams.get("exclude_replies") === "true";

    const user = await getCurrentUser();
    const userId = user?.id;

    const { posts, total } = await postService.getTimelinePosts({
      userId,
      page,
      limit,
      type,
      excludeReplies,
    });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
