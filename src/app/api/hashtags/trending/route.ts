import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Calculate the date 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // Use Prisma's standard query approach instead of raw SQL
    // First, get all post hashtags from the last 24 hours
    const recentPostHashtags = await prisma.postHashtag.findMany({
      where: {
        post: {
          createdAt: {
            gte: oneDayAgo,
          },
          deletedAt: null,
        },
      },
      include: {
        hashtag: true,
      },
    });

    // Count occurrences of each hashtag
    const hashtagCounts: Record<string, number> = {};

    recentPostHashtags.forEach((ph) => {
      const hashtag = ph.hashtag.hashtag;
      hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
    });

    // Convert to array and sort
    const trendingHashtags = Object.entries(hashtagCounts)
      .map(([hashtag, count]) => ({
        hashtag,
        post_count: count,
      }))
      .sort((a, b) => b.post_count - a.post_count)
      .slice(0, limit);

    // Handle empty results
    if (!trendingHashtags || trendingHashtags.length === 0) {
      return NextResponse.json({ trendingHashtags: [] });
    }

    // Map the results
    const formattedHashtags = trendingHashtags.map((item) => ({
      hashtag: `#${item.hashtag}`,
      topic: item.hashtag,
      posts: `${item.post_count}`,
    }));

    return NextResponse.json({ trendingHashtags: formattedHashtags });
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending hashtags", trendingHashtags: [] },
      { status: 500 },
    );
  }
}
