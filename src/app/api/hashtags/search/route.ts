import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "5");

    // If query is empty, return empty array
    if (!query) {
      return NextResponse.json({ hashtags: [] });
    }

    // Search for hashtags matching the query
    const hashtags = await prisma.hashtag.findMany({
      where: {
        hashtag: { contains: query, mode: "insensitive" },
      },
      take: limit,
      select: {
        id: true,
        hashtag: true,
        trendingScore: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    // Format the response
    const formattedHashtags = hashtags.map((hashtag) => ({
      id: hashtag.id,
      name: hashtag.hashtag,
      postCount: hashtag._count?.posts || 0,
    }));

    return NextResponse.json({ hashtags: formattedHashtags });
  } catch (error: any) {
    console.error("Error searching hashtags:", error);
    return NextResponse.json(
      {
        error: "Failed to search hashtags",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
