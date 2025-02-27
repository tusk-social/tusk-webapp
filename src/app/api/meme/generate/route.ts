import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const username = process.env.IMGFLIP_USERNAME;
    const password = process.env.IMGFLIP_PASSWORD;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Imgflip API credentials not configured" },
        { status: 500 },
      );
    }

    // Get request body as JSON from client
    const body = await request.json();
    const { template_id, captions } = body;

    if (!template_id || !captions || !Array.isArray(captions)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Create form data for the imgflip API request
    const formData = new FormData();
    formData.append("template_id", template_id);
    formData.append("username", username);
    formData.append("password", password);

    // Add captions to form data
    captions.forEach((caption: string, index: number) => {
      formData.append(`text${index}`, caption);
    });

    // Make API request to Imgflip (using FormData as imgflip requires)
    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          error: `Failed to generate meme: ${data.error_message || "Unknown error"}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating meme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
