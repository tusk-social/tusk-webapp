import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/jwt";
import { prisma } from "@/lib/db";

/**
 * Get the current user from the access token (server-side only)
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken?.value) {
    return null;
  }

  const decodedToken = decodeJwt(accessToken.value);
  const walletAddress = decodedToken?.properties?.id;

  if (!walletAddress) {
    return null;
  }

  return prisma.user.findUnique({
    where: { walletAddress },
  });
}

/**
 * Get the current user's wallet address from the access token (server-side only)
 * @returns The wallet address or null if not authenticated
 */
export async function getCurrentWalletAddress() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken?.value) {
    return null;
  }

  const decodedToken = decodeJwt(accessToken.value);
  return decodedToken?.properties?.id || null;
}

/**
 * Check if the user is authenticated (server-side only)
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken?.value) {
    return false;
  }

  const decodedToken = decodeJwt(accessToken.value);
  return !!decodedToken?.properties?.id;
}
