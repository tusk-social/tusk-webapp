import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SAMPLE_COMMENTS } from "@/services/mockData";
import { Post } from "@/types/post";

// Validation schema for comment creation
const createCommentSchema = z.object({
  content: z.string().min(1).max(280),
  image: z.string().nullable(),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

interface Params {
  params: Promise<{
    postId: string;
  }>;
}

export async function GET(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    const { searchParams } = new URL(request.url);
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
    const comments = SAMPLE_COMMENTS.get(params.postId) || [];

    const start = (page - 1) * limit;
    const end = start + limit;
    const hasMore = comments.length > end;

    return NextResponse.json({
      comments: comments.slice(start, end),
      hasMore,
      total: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    const body = await request.json();
    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid comment data" },
        { status: 400 },
      );
    }

    const newComment = {
      id: Math.random().toString(36).substring(7),
      type: validation.data.image ? "image" : "text",
      content: validation.data.content,
      author: {
        name: "Current User",
        username: "currentuser",
        avatar: "/avatars/default.jpg",
      },
      createdAt: "now",
      stats: {
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0,
      },
      ...(validation.data.image && { images: [validation.data.image] }),
    };

    const comments = SAMPLE_COMMENTS.get(params.postId) || [];
    comments.unshift(newComment as Post);
    SAMPLE_COMMENTS.set(params.postId, comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
