import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get count of unread notifications
    const count = await prisma.notification.count({
      where: {
        userId: currentUser.id,
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Error getting unread notifications count:", error);
    return NextResponse.json(
      { error: "Failed to get unread notifications count" },
      { status: 500 },
    );
  }
}
