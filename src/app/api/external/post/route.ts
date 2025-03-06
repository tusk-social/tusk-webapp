import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";
import { postService } from "@/services/postService";
import { z } from "zod";

// Validate request body
const createPostSchema = z.object({
  text: z.string().min(1).max(280),
  parentId: z.string().optional(),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    )
    .optional(),
});

export const POST = withApiAuth(async (request: NextRequest, context, user) => {
  try {
    const body = await request.json();

    // Validate request body
    const { text, parentId, media } = createPostSchema.parse(body);

    // Create the post
    const post = await postService.createPost({
      userId: user.id,
      text,
      parentPostId: parentId,
      media: media || undefined,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
});
