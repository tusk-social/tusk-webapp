import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";
import { z } from "zod";

// Validation schema for pagination
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate pagination parameters
    const validation = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const { page, limit } = validation.data;

    // Check if the post exists
    const post = await postService.getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch replies for the post
    const replies = await postService.getPostReplies(postId, page, limit);
    const totalReplies = await postService.getPostRepliesCount(postId);

    const hasMore = totalReplies > page * limit;

    return NextResponse.json({
      replies,
      hasMore,
      total: totalReplies,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 },
    );
  }
}

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
    const { text, media } = await request.json();

    // Validate request body
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 },
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: "Reply text cannot exceed 280 characters" },
        { status: 400 },
      );
    }

    // Check if the parent post exists
    const parentPost = await postService.getPostById(postId);
    if (!parentPost) {
      return NextResponse.json(
        { error: "Parent post not found" },
        { status: 404 },
      );
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
      { status: 500 },
    );
  }
}
