import { NextRequest, NextResponse } from "next/server";
import { middleware as chopinMiddleware } from "@chopinframework/next";

const publicPaths = [
  "/",
  "/_chopin/login",
  "/_chopin/auth-callback",
  "/auth/onboarding",
];

// List of reserved paths that should not be treated as usernames
const RESERVED_PATHS = [
  "home",
  "settings",
  "notifications",
  "messages",
  "explore",
  "search",
  "profile",
  "auth",
  "api",
  "_chopin",
  "tmp",
  "debug",
];

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

function isTokenExpired(decodedToken: any) {
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  console.log("==== PATHNAME ====");
  console.log(pathname);
  console.log("==== END PATHNAME ====");

  // Allow external API endpoints - they use their own authentication
  if (pathname.startsWith("/api/external/")) {
    return NextResponse.next();
  }

  // Allow OG image endpoint and public post API endpoint
  if (
    pathname.startsWith("/api/og") ||
    (pathname.startsWith("/api/posts/") && method === "GET")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_chopin") || pathname.startsWith("/auth/login")) {
    return chopinMiddleware(request);
  }

  if (pathname.startsWith("/api") && method !== "GET") {
    return chopinMiddleware(request);
  }

  // Check if it's a post status page
  const isPostPage = /^\/[^\/]+\/status\/[^\/]+$/.test(pathname);
  if (isPostPage) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some((path) => pathname === path);

  console.log("==== IS PUBLIC PATH ====");
  console.log(isPublicPath);
  console.log("==== END IS PUBLIC PATH ====");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token");

  if (!accessToken) {
    console.log("No access token found");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decodedToken = decodeJwt(accessToken.value);

  console.log("==== DECODED TOKEN ====");
  console.log(JSON.stringify(decodedToken, null, 2));
  console.log("==== END DECODED TOKEN ====");

  if (!decodedToken) {
    console.log("Token could not be decoded");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("access_token");
    return response;
  }

  if (isTokenExpired(decodedToken)) {
    console.log("Token is expired");
    console.log("Token exp:", decodedToken.exp);
    console.log("Current time:", Math.floor(Date.now() / 1000));
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("access_token");
    return response;
  }

  if (!decodedToken.properties?.id) {
    console.log("Token missing required property: properties.id");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("access_token");
    return response;
  }

  console.log(
    "Token is valid. User Wallet Address:",
    decodedToken.properties?.id,
  );

  const url = request.nextUrl.clone();
  const path = url.pathname.split("/")[1]; // Get the first segment after /

  // If the path is in the reserved list, don't do anything
  if (RESERVED_PATHS.includes(path)) {
    return NextResponse.next();
  }

  // Otherwise, let it go through to the [username] route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
