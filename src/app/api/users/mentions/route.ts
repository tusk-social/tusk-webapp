import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    // If query is less than 2 characters, return empty array
    if (query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // First, get users that the current user follows and match the query
    const followedUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { displayName: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            followers: {
              some: {
                followerId: currentUser.id,
              },
            },
          },
          { deactivatedAt: null },
        ],
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

    // If we have enough followed users, return them
    if (followedUsers.length >= limit) {
      return NextResponse.json({
        users: followedUsers.map((user) => ({
          id: user.id,
          username: user.username,
          name: user.displayName,
          avatar:
            user.avatarUrl || `https://api.randomx.ai/avatar/${user.username}`,
          bio: user.bio || "",
        })),
      });
    }

    // Otherwise, get other users that match the query but exclude already found users and the current user
    const otherUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { displayName: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            id: {
              notIn: [...followedUsers.map((user) => user.id), currentUser.id],
            },
          },
          { deactivatedAt: null },
        ],
      },
      take: limit - followedUsers.length,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
      },
    });

    // Combine followed users and other users
    const combinedUsers = [...followedUsers, ...otherUsers].map((user) => ({
      id: user.id,
      username: user.username,
      name: user.displayName,
      avatar:
        user.avatarUrl || `https://api.randomx.ai/avatar/${user.username}`,
      bio: user.bio || "",
    }));

    return NextResponse.json({ users: combinedUsers });
  } catch (error: any) {
    console.error("Error fetching mention suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch mention suggestions", details: error.message },
      { status: 500 },
    );
  }
}
