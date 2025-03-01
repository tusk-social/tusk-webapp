import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

// GET /api/follow/status?targetId=123 - Check if current user follows target user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    const targetId = request.nextUrl.searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json(
        { message: "Target user ID is required" },
        { status: 400 },
      );
    }

    // If checking self, return false (can't follow yourself)
    if (currentUser.id === targetId) {
      return NextResponse.json({ isFollowing: false }, { status: 200 });
    }

    // Check if follow relationship exists
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: currentUser.id,
          followedId: targetId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { isFollowing: false, error: "Failed to check follow status" },
      { status: 500 },
    );
  }
}
