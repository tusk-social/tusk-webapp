import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const { text } = await request.json();

    // Validate text length if provided
    if (text && text.length > 280) {
      return NextResponse.json(
        { error: "Text cannot exceed 280 characters" },
        { status: 400 },
      );
    }

    // Check if the original post exists
    const originalPost = await postService.getPostById(postId);
    if (!originalPost) {
      return NextResponse.json(
        { error: "Original post not found" },
        { status: 404 },
      );
    }

    // Check if user is trying to repost their own post
    if (originalPost.user.id === user.id) {
      return NextResponse.json(
        { error: "You cannot repost your own post" },
        { status: 400 },
      );
    }

    // Create the repost
    const repost = await postService.createRepost({
      userId: user.id,
      text: text || "",
      repostPostId: postId,
    });

    return NextResponse.json(repost, { status: 201 });
  } catch (error) {
    console.error("Error creating repost:", error);
    return NextResponse.json(
      { error: "Failed to create repost" },
      { status: 500 },
    );
  }
}
