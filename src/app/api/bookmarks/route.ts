import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get bookmarked posts
    const { posts, total } = await postService.getBookmarkedPosts(
      user.id,
      page,
      limit,
    );

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarked posts" },
      { status: 500 },
    );
  }
}
