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

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            padding: 80,
            fontFamily: "system-ui, sans-serif",
            position: "relative",
          }}
        >
          {/* Author Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 40,
              width: "100%",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                overflow: "hidden",
                marginRight: 20,
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  width={80}
                  height={80}
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
                  fontSize: 32,
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
                  fontSize: 24,
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
            }}
          >
            {/* Text Content */}
            <div
              style={{
                fontSize: firstImage ? 32 : 40,
                fontWeight: "normal",
                color: "white",
                flex: firstImage ? "1" : "auto",
                maxWidth: firstImage ? "50%" : "100%",
                display: "flex",
              }}
            >
              {text}
            </div>

            {/* Post Image */}
            {firstImage && (
              <div
                style={{
                  flex: 1,
                  height: 300,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#333",
                  display: "flex",
                }}
              >
                <img
                  src={firstImage}
                  alt="Post media"
                  width={400}
                  height={300}
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
              bottom: 40,
              right: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #be3fd5 0%, #be3fd5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              T
            </div>
            <span
              style={{
                fontSize: 24,
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
