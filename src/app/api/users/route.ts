import { NextRequest, NextResponse } from "next/server";
import { userService, CreateUserData } from "@/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.displayName || !body.username) {
      return NextResponse.json(
        { error: "Display name and username are required" },
        { status: 400 },
      );
    }

    // Check if username is already taken
    const existingUser = await userService.getUserByUsername(body.username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 },
      );
    }

    // Create user data object
    const userData: CreateUserData = {
      displayName: body.displayName,
      username: body.username,
      walletAddress: body.walletAddress,
      avatarUrl: body.avatarUrl,
      profileBannerUrl: body.profileBannerUrl,
      bio: body.bio,
      location: body.location,
      websiteUrl: body.websiteUrl,
    };

    // Create the user
    const user = await userService.createUser(userData);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let result;

    if (query) {
      // Search users
      result = await userService.searchUsers(query, page, limit);
    } else {
      // List users
      result = await userService.listUsers(page, limit, {
        deactivatedAt: null,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
