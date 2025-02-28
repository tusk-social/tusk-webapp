import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/userService";

interface Params {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(request: NextRequest, props: Params) {
  try {
    const params = await props.params;
    const user = await userService.getUserByUsername(params.username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
