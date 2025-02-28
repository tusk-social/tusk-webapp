import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  console.log("content", content);
  return NextResponse.json({ message: "Post created successfully" });
}
