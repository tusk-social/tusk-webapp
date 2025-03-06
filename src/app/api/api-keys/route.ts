import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-auth";
import { apiKeyService } from "@/services/apiKeyService";
import { z } from "zod";

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const schema = z.object({
      name: z.string().min(1).max(100),
    });

    const { name } = schema.parse(body);

    const { secret, key } = await apiKeyService.createApiKey({
      userId: currentUser.id,
      name,
    });

    return NextResponse.json({ secret, key });
  } catch (error) {
    console.error("Error creating API key:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 },
    );
  }
}

// GET /api/api-keys - List all API keys for the current user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await apiKeyService.getApiKeys(currentUser.id);
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

// DELETE /api/api-keys?id={keyId} - Revoke an API key
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json({ error: "Missing key ID" }, { status: 400 });
    }

    await apiKeyService.revokeApiKey(keyId, currentUser.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500 },
    );
  }
}
