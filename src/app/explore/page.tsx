import AppLayout from "@/components/layout/AppLayout";
import TrendingTopics from "@/components/explore/TrendingTopics";
import ExplorePosts from "@/components/explore/ExplorePosts";

export default function ExplorePage() {
  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <div className="flex items-center gap-4 px-4 py-3">
            <div>
              <h1 className="text-xl font-bold">Explore</h1>
            </div>
          </div>
        </div>
        <TrendingTopics />
        <ExplorePosts />
      </main>
    </AppLayout>
  );
}
