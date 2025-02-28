import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response
    const response = NextResponse.json({ success: true });

    // Set the cookie with an expiration date in the past to delete it
    response.cookies.set({
      name: "access_token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
