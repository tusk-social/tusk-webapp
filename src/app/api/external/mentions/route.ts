import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

export const GET = withApiAuth(async (request: NextRequest, context, user) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const cursor = searchParams.get("cursor");
    const includeParentPosts =
      searchParams.get("includeParentPosts") === "true";

    // Build the query
    const mentions = await prisma.mention.findMany({
      where: {
        mentionedUserId: user.id,
      },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              postId_mentionedUserId: {
                postId: cursor,
                mentionedUserId: user.id,
              },
            },
          }
        : {}),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            ...(includeParentPosts
              ? {
                  parentPost: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          username: true,
                          displayName: true,
                          avatarUrl: true,
                        },
                      },
                    },
                  },
                }
              : {}),
          },
        },
      },
    });

    // Get the next cursor
    const nextCursor =
      mentions.length === limit ? mentions[mentions.length - 1].postId : null;

    // Format the response
    const formattedMentions = mentions.map((mention) => ({
      id: mention.postId,
      text: mention.post.text,
      createdAt: mention.post.createdAt,
      author: mention.post.user,
      parentPost: includeParentPosts ? mention.post.parentPost : undefined,
    }));

    return NextResponse.json({
      mentions: formattedMentions,
      pagination: {
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error fetching mentions:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentions" },
      { status: 500 },
    );
  }
});
