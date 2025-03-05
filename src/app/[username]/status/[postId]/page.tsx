import { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";
import GuestLayout from "@/components/layout/GuestLayout";
import PostDetail from "@/components/post/PostDetail";
import { notFound } from "next/navigation";
import { postService } from "@/services/postService";
import { cookies } from "next/headers";

interface PostPageProps {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const { postId } = await params;

    // Fetch post data from the API using the full URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${postId}`,
    );
    if (!response.ok) return { title: "Post not found | Tusk" };

    const post = await response.json();
    if (!post) return { title: "Post not found | Tusk" };

    const userName = post.user?.displayName || "Unknown User";
    const postText = post.text || "";

    // Create the OG image URL with just the post ID
    const ogImageUrl = new URL("/api/og/post", process.env.NEXT_PUBLIC_APP_URL);
    ogImageUrl.searchParams.set("postId", postId);

    return {
      title: `${userName} on Tusk: "${postText?.substring(0, 60) || ""}${postText?.length > 60 ? "..." : ""}"`,
      description: postText || "View this post on Tusk",
      openGraph: {
        title: `${userName} on Tusk`,
        description: postText || "View this post on Tusk",
        images: [
          {
            url: ogImageUrl.toString(),
            width: 1200,
            height: 630,
            alt: `${userName}'s post on Tusk`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${userName} on Tusk`,
        description: postText || "View this post on Tusk",
        images: [ogImageUrl.toString()],
      },
    };
  } catch (error) {
    console.error("Error fetching post metadata:", error);
    return { title: "Post | Tusk" };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId, username } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const isGuest = !accessToken?.value;

  try {
    const post = await postService.getPostById(postId);

    if (!post) {
      notFound();
    }

    const postUsername = post.user?.username;
    if (postUsername && postUsername !== username) {
      notFound();
    }

    const Layout = isGuest ? GuestLayout : AppLayout;

    return (
      <Layout>
        <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
          <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
            <h1 className="text-xl font-bold p-4">Post</h1>
          </div>
          <PostDetail post={post as Post} isGuest={isGuest} />
        </main>
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
