import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/userService";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ address: string }> },
) {
  try {
    const params = await props.params;
    console.log("API: Checking user with wallet address:", params.address);
    const user = await userService.getUserByWalletAddress(params.address);

    if (!user) {
      console.log("API: User not found with wallet address:", params.address);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("API: User found with wallet address:", params.address);
    return NextResponse.json(user);
  } catch (error) {
    console.error("API: Error fetching user by wallet address:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
