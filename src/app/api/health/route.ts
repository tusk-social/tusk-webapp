import { Oracle } from "@chopinframework/next";
import { NextResponse } from "next/server";

/**
 * Liveness check endpoint
 * GET /api/health/live
 *
 * This endpoint is used by Kubernetes liveness probes to determine
 * if the application is running and responsive.
 *
 * It performs a very simple check and should return quickly.
 *
 * Returns:
 * - status: "alive" if the service is running
 * - timestamp: current server time
 */
export async function GET() {
  try {
    // This is a simple check that just verifies the application is running
    // and can respond to HTTP requests
    const now = await Oracle.now();
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
