import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import crypto from "crypto";

/**
 * Middleware to authenticate API requests using API key
 * Checks for X-API-Key header and validates it against the database
 */
export async function authenticateApiKey(request: NextRequest) {
  try {
    const apiKey = request.headers.get("X-API-Key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 },
      );
    }

    // Find the API key in the database
    const key = await prisma.apiKey.findUnique({
      where: { key: crypto.createHash("sha256").update(apiKey).digest("hex") },
      include: {
        user: true,
      },
    });

    console.log("key", key);
    // Check if key exists and is active
    if (!key || !key.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive API key" },
        { status: 401 },
      );
    }

    // Update lastUsedAt timestamp
    await prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    });

    // Return the user for the route handler to use
    return key.user;
  } catch (error) {
    console.error("Error authenticating API key:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

type ApiRouteHandler = (
  request: NextRequest,
  context: { params: any },
  user: User,
) => Promise<NextResponse>;

/**
 * Higher-order function to wrap API route handlers with API key authentication
 */
export function withApiAuth(handler: ApiRouteHandler) {
  return async (request: NextRequest, context: { params: any }) => {
    const user = await authenticateApiKey(request);

    if (user instanceof NextResponse) {
      return user; // This is an error response
    }

    return handler(request, context, user);
  };
}
