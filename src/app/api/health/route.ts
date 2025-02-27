import { Oracle } from "@chopinframework/next";
import { NextResponse } from "next/server";

/**
 * Liveness check endpoint
 * GET /api/health/live
 *
 * It performs a very simple check and should return quickly.
 *
 * Returns:
 * - status: "alive" if the service is running
 * - timestamp: current server time from the oracle
 */
export async function GET() {
  const now = await Oracle.now();

  try {
    return NextResponse.json(
      {
        status: "alive",
        timestamp: now,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Liveness check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Liveness check failed",
        timestamp: now,
      },
      { status: 500 },
    );
  }
}
