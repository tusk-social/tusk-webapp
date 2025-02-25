import { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";
import PostDetail from "@/components/post/PostDetail";
import { SAMPLE_POST } from "@/services/mockData";

interface Props {
  params: {
    username: string;
    postId: string;
  };
}

export default function PostPage({ params }: Props) {
  // In a real app, we would fetch the post data here based on username and postId
  const post = SAMPLE_POST;

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Post</h1>
        </div>
        <PostDetail post={post} />
      </main>
    </AppLayout>
  );
} 