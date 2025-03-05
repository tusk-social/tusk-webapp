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
      return NextResponse.json({ users: [] });
    }

    // Search for users matching the query
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
        ],
        deactivatedAt: null,
      },
      take: limit,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users", details: error.message },
      { status: 500 },
    );
  }
}
