import AppLayout from "@/components/layout/AppLayout";
import BookmarksList from "@/components/bookmarks/BookmarksList";

export default function BookmarksPage() {
  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Bookmarks</h1>
        </div>
        <BookmarksList />
      </main>
    </AppLayout>
  );
} 