import { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";
import PostDetail from "@/components/post/PostDetail";

// This is temporary sample data - in a real app, this would come from an API
const SAMPLE_POST: Post = {
  id: "1",
  type: "text",
  content: `Just launched Tusk - a modern Twitter alternative! 🚀

  Built with @chopinframework and @celestia, for #Mammothon. What do you think?
  `,  author: {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://api.randomx.ai/avatar/johndoe"
  },
  createdAt: "2h",
  stats: {
    replies: 42,
    reposts: 128,
    likes: 500,
    views: 10000
  },
  isBookmarked: false,
  comments: [
    {
      id: "comment1",
      type: "text",
      content: "This is amazing! Looking forward to using it. 🎉",
      author: {
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.randomx.ai/avatar/janesmith"
      },
      createdAt: "1h",
      stats: {
        replies: 2,
        reposts: 1,
        likes: 15,
        views: 100
      }
    },
    {
      id: "comment2",
      type: "text",
      content: "Great work! The UI looks really clean. How long did it take to build?",
      author: {
        name: "Tech Enthusiast",
        username: "techlover",
        avatar: "https://api.randomx.ai/avatar/techlover"
      },
      createdAt: "30m",
      stats: {
        replies: 1,
        reposts: 0,
        likes: 8,
        views: 50
      }
    }
  ]
};

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