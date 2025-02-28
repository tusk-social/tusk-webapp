import { NextRequest, NextResponse } from "next/server";
import { userService, UpdateUserData } from "@/services/userService";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    const user = await userService.getUserById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await userService.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username is being updated and if it's already taken
    if (body.username && body.username !== existingUser.username) {
      const userWithUsername = await userService.getUserByUsername(
        body.username,
      );
      if (userWithUsername) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 },
        );
      }
    }

    // Create update data object
    const updateData: UpdateUserData = {};

    // Only include fields that are provided
    if (body.displayName !== undefined)
      updateData.displayName = body.displayName;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
    if (body.profileBannerUrl !== undefined)
      updateData.profileBannerUrl = body.profileBannerUrl;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl;

    // Update the user
    const updatedUser = await userService.updateUser(params.id, updateData);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    // Check if user exists
    const existingUser = await userService.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deactivate the user instead of deleting
    const deactivatedUser = await userService.deactivateUser(params.id);

    return NextResponse.json(deactivatedUser);
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 },
    );
  }
}
