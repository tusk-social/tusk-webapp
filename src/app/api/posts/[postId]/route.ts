import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const user = await getCurrentUser();

    const post = await postService.getPostById(postId);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update view count would need to be implemented in postService
    // For now, we'll just return the post
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
} 