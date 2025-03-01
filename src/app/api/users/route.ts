import { NextRequest, NextResponse } from "next/server";
import { userService, CreateUserData } from "@/services/userService";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { displayName, username, walletAddress } = await request.json();

    // Validate required fields
    if (!displayName || !username || !walletAddress) {
      return NextResponse.json(
        { error: "Display name, username, and wallet address are required" },
        { status: 400 },
      );
    }

    // Validate display name length
    if (displayName.length > 20) {
      return NextResponse.json(
        { error: "Display name must be at most 20 characters long" },
        { status: 400 },
      );
    }

    // Validate username length
    if (username.length < 6) {
      return NextResponse.json(
        { error: "Username must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error: "Username can only contain letters, numbers, and underscores",
        },
        { status: 400 },
      );
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 },
      );
    }

    // Check if wallet address is already registered
    const existingWallet = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Wallet address is already registered" },
        { status: 409 },
      );
    }

    // Create user data object
    const userData: CreateUserData = {
      displayName,
      username,
      walletAddress,
      avatarUrl: "",
      profileBannerUrl: "",
      bio: "",
      location: "",
      websiteUrl: "",
    };

    // Create the user
    const user = await userService.createUser(userData);

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
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

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken?.value) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 },
      );
    }

    // Decode the token to get the wallet address
    const decodedToken = decodeJwt(accessToken.value);
    const walletAddress = decodedToken?.properties?.id;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 },
      );
    }

    // Find the authenticated user
    const authenticatedUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the JSON data from the request
    const {
      displayName,
      bio,
      location,
      websiteUrl,
      avatarUrl,
      profileBannerUrl,
    } = await request.json();

    // Validate required fields
    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 },
      );
    }

    // Prepare update data
    const updateData: any = {
      displayName,
      bio: bio || null,
      location: location || null,
      websiteUrl: websiteUrl || null,
    };

    // Add avatar URL if provided
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    // Add banner URL if provided
    if (profileBannerUrl) {
      updateData.profileBannerUrl = profileBannerUrl;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: authenticatedUser.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
