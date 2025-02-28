import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { postService } from "@/services/postService";

interface Params {
  params: Promise<{
    postId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  props: Params
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { postId } = params;

    // Check if the post exists
    const post = await postService.getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await postService.likePost(user.id, postId);

    // Get the updated post
    const updatedPost = await postService.getPostById(postId);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = params;

    // Check if the post exists
    const post = await postService.getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await postService.unlikePost(user.id, postId);

    // Get the updated post
    const updatedPost = await postService.getPostById(postId);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
} 