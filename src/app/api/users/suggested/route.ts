import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

// GET /api/users/suggested - Get suggested users to follow
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    // If not logged in, return random users
    if (!currentUser) {
      const randomUsers = await prisma.user.findMany({
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      });

      return NextResponse.json({ users: randomUsers }, { status: 200 });
    }

    // Get users that the current user is not following
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      select: {
        followedId: true,
      },
    });

    const followingIds = following.map((f) => f.followedId);

    // Add current user's ID to exclude from suggestions
    followingIds.push(currentUser.id);

    // Find users not being followed
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: followingIds,
        },
      },
      take: 3,
      orderBy: [
        { followersCount: "desc" }, // Popular users first
        { createdAt: "desc" }, // Then newer users
      ],
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return NextResponse.json({ users: suggestedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error getting suggested users:", error);
    return NextResponse.json(
      { message: "Failed to get suggested users" },
      { status: 500 },
    );
  }
}
