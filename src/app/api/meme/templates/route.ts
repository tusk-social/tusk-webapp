import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes");
    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Failed to fetch meme templates from Imgflip API" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching meme templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
