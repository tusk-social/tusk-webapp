import { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";
import PostDetail from "@/components/post/PostDetail";
import { notFound } from "next/navigation";
import { postService } from "@/services/postService";

interface PostPageProps {
  params: Promise<{
    username: string;
    postId: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const { postId } = await params;
    const post = await postService.getPostById(postId);
    if (!post) return { title: "Post not found | Tusk" };

    const userName = post.user?.displayName || "Unknown User";
    return {
      title: `${userName} on Tusk: "${post.text?.substring(0, 60) || ""}${post.text?.length > 60 ? "..." : ""}"`,
      description: post.text || "View this post on Tusk",
    };
  } catch (error) {
    console.error("Error fetching post metadata:", error);
    return { title: "Post | Tusk" };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId, username } = await params;
  try {
    const post = await postService.getPostById(postId);

    if (!post) {
      notFound();
    }

    const postUsername = post.user?.username;
    if (postUsername && postUsername !== username) {
      notFound();
    }

    return (
      <AppLayout>
        <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
          <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
            <h1 className="text-xl font-bold p-4">Post</h1>
          </div>
          <PostDetail post={post as Post} />
        </main>
      </AppLayout>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
