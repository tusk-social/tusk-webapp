import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/userService";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";

// Validation utilities
const sanitizeInput = (input: string | null): string | null => {
  if (input === null || input === undefined) return null;
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

const isValidUrl = (url: string | null): boolean => {
  if (!url) return true; // Empty URLs are valid (optional field)
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

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
    const userId = params.id;

    // Check if the current user is authorized to update this profile
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TO-DO: Handle file uploads

    const formData = await request.formData();
    const displayName = sanitizeInput(formData.get("displayName") as string);
    const bio = sanitizeInput(formData.get("bio") as string);
    const location = sanitizeInput(formData.get("location") as string);
    const websiteUrl = formData.get("websiteUrl") as string;

    // Validate the data
    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 },
      );
    }

    if (displayName.length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (websiteUrl && !isValidUrl(websiteUrl)) {
      return NextResponse.json(
        { error: "Please enter a valid URL" },
        { status: 400 },
      );
    }

    if (location && location.length > 30) {
      return NextResponse.json(
        { error: "Location must be less than 30 characters" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        displayName,
        bio,
        location,
        websiteUrl,
        // TO-DO: Handle file uploads
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
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
