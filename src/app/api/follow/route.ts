import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { userService } from "@/services/userService";

// POST /api/follow - Follow or unfollow a user
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "You must be logged in to follow users" },
        { status: 401 },
      );
    }

    const { targetId, action } = await request.json();

    if (
      !targetId ||
      !action ||
      (action !== "follow" && action !== "unfollow")
    ) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 },
      );
    }

    // Check if user is trying to follow themselves
    if (currentUser.id === targetId) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 },
      );
    }

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (action === "follow") {
      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId: currentUser.id,
            followedId: targetId,
          },
        },
      });

      if (existingFollow) {
        return NextResponse.json(
          { message: "Already following this user" },
          { status: 400 },
        );
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followedId: targetId,
        },
      });

      // Update follower and following counts
      await userService.incrementFollowersCount(targetId);
      await userService.incrementFollowingCount(currentUser.id);

      // Create notification for the followed user
      await prisma.notification.create({
        data: {
          userId: targetId, // User being followed receives the notification
          actorId: currentUser.id, // User who followed
          type: "FOLLOW",
          isRead: false,
        },
      });

      return NextResponse.json(
        { message: "Successfully followed user" },
        { status: 200 },
      );
    } else {
      // Delete follow relationship if it exists
      const deletedFollow = await prisma.follow
        .delete({
          where: {
            followerId_followedId: {
              followerId: currentUser.id,
              followedId: targetId,
            },
          },
        })
        .catch(() => null);

      if (!deletedFollow) {
        return NextResponse.json(
          { message: "You are not following this user" },
          { status: 400 },
        );
      }

      // Update follower and following counts
      await userService.decrementFollowersCount(targetId);
      await userService.decrementFollowingCount(currentUser.id);

      return NextResponse.json(
        { message: "Successfully unfollowed user" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error updating follow status:", error);
    return NextResponse.json(
      { message: "Failed to update follow status" },
      { status: 500 },
    );
  }
}
