import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = (searchParams.get("type") || "all") as "all" | "replies" | "media";

    const { posts, total } = await postService.getUserPosts({
      username,
      page,
      limit,
      type,
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
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
} 