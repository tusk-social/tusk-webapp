import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Missing post ID", { status: 400 });
    }

    // Fetch post data from our API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${postId}`,
    );
    if (!response.ok) {
      return new Response("Post not found", { status: 404 });
    }

    const post = await response.json();
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const authorName = post.user?.displayName || "Unknown User";
    const authorUsername = post.user?.username || "unknown";
    const authorAvatar = post.user?.avatarUrl;
    const text = post.text || "";

    // Get image URL from media (handling both single object and array formats)
    const media = post.media;
    const firstImage = Array.isArray(media)
      ? media.find((item) => item.type === "image")?.url
      : media?.type === "image"
        ? media.url
        : null;

    // Truncate text if it's too long
    const truncatedText = text.length > 280 ? `${text.slice(0, 280)}...` : text;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "black",
            padding: "60px 80px",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
          }}
        >
          {/* Author Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 32,
              width: "100%",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                overflow: "hidden",
                marginRight: 16,
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  width={64}
                  height={64}
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : (
                authorName.charAt(0)
              )}
            </div>
            {/* Author Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 4,
                  display: "flex",
                }}
              >
                {authorName}
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: "#666",
                  display: "flex",
                }}
              >
                @{authorUsername}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div
            style={{
              display: "flex",
              flexDirection: firstImage ? "row" : "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              gap: 40,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Text Content */}
            <div
              style={{
                fontSize: firstImage ? 28 : 36,
                fontWeight: "normal",
                color: "white",
                flex: firstImage ? "1" : "auto",
                maxWidth: firstImage ? "50%" : "100%",
                display: "flex",
                lineHeight: 1.4,
                overflow: "hidden",
                maxHeight: firstImage ? 280 : 400,
              }}
            >
              {truncatedText}
            </div>

            {/* Post Image */}
            {firstImage && (
              <div
                style={{
                  flex: 1,
                  maxHeight: 280,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#333",
                  display: "flex",
                }}
              >
                <img
                  src={firstImage}
                  alt="Post media"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          {/* Tusk Logo */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              right: 32,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #be3fd5 0%, #be3fd5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              T
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                display: "flex",
              }}
            >
              Tusk
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Add support for loading remote images
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=31536000, immutable",
        },
      },
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
