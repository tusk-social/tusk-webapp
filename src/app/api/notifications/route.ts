import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import { Notification, NotificationType } from "@/types/notification";
import { Prisma } from "@prisma/client";

// GET /api/notifications
// Fetch user's notifications with pagination
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor"); // For pagination
    const limit = parseInt(searchParams.get("limit") || "20");
    const autoMarkRead = searchParams.get("autoMarkRead") !== "false"; // Default to true
    const type = searchParams.get("type") as NotificationType | null; // Filter by notification type
    // Build where clause
    const where = {
      userId: currentUser.id,
      ...(type ? { type } : {}),
    };

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where,
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            text: true,
            media: true,
            createdAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    // If autoMarkRead is true, mark fetched notifications as read
    if (autoMarkRead && notifications.length > 0) {
      const unreadNotificationIds = notifications
        .filter((n: { isRead: boolean }) => !n.isRead)
        .map((n: { id: string }) => n.id);

      if (unreadNotificationIds.length > 0) {
        await prisma.notification.updateMany({
          where: {
            id: {
              in: unreadNotificationIds,
            },
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
      }
    }

    // Get next cursor
    const nextCursor = notifications[notifications.length - 1]?.id;

    // Format notifications for response
    const formattedNotifications = notifications.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      actor: {
        id: notification.actor.id,
        username: notification.actor.username,
        displayName: notification.actor.displayName,
        avatar:
          notification.actor.avatarUrl ||
          `https://api.randomx.ai/avatar/${notification.actor.username}`,
      },
      post: notification.post
        ? {
            id: notification.post.id,
            content: notification.post.text,
            media: notification.post.media,
            createdAt: notification.post.createdAt,
            username: notification.post.user.username,
          }
        : undefined,
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      nextCursor,
      hasMore: notifications.length === limit,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// PATCH /api/notifications
// Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Update notifications
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        userId: currentUser.id, // Ensure user can only mark their own notifications
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 },
    );
  }
}
