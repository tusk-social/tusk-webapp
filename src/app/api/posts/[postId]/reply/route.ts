import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = params;
    const { text, media } = await request.json();

    // Validate request body
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: "Reply text cannot exceed 280 characters" },
        { status: 400 }
      );
    }

    // Check if the parent post exists
    const parentPost = await postService.getPostById(postId);
    if (!parentPost) {
      return NextResponse.json({ error: "Parent post not found" }, { status: 404 });
    }

    // Create the reply
    const reply = await postService.createPost({
      userId: user.id,
      text,
      media,
      parentPostId: postId,
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
} 