"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, User, Hash } from "lucide-react";
import PostCard from "@/components/timeline/PostCard";

// Create a separate component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    users: any[];
    hashtags: any[];
    posts: any[];
  }>({
    users: [],
    hashtags: [],
    posts: [],
  });

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}&limit=20`,
        );

        // Fetch hashtags
        const hashtagsResponse = await fetch(
          `/api/hashtags/search?q=${encodeURIComponent(query)}&limit=20`,
        );

        // Fetch posts
        const postsResponse = await fetch(
          `/api/posts/search?q=${encodeURIComponent(query)}&limit=20`,
        );

        if (usersResponse.ok && hashtagsResponse.ok && postsResponse.ok) {
          const usersData = await usersResponse.json();
          const hashtagsData = await hashtagsResponse.json();
          const postsData = await postsResponse.json();

          setResults({
            users: usersData.users || [],
            hashtags: hashtagsData.hashtags || [],
            posts: postsData.posts || [],
          });
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Calculate total results count
  const totalResults =
    results.users.length + results.hashtags.length + results.posts.length;

  return (
    <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
      <div className="sticky top-0 z-[100] backdrop-blur-xl bg-black/80 border-b border-gray-800">
        <div className="flex items-center gap-6 p-4">
          <Link href="/home" className="rounded-full p-2 hover:bg-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Search</h1>
            <p className="text-gray-500 text-sm">
              {isLoading
                ? "Searching..."
                : totalResults > 0
                  ? `${totalResults} results for "${query}"`
                  : query
                    ? `No results for "${query}"`
                    : "Enter a search term"}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 relative">
          <div className="bg-gray-900 rounded-full relative">
            <input
              type="text"
              defaultValue={query}
              placeholder="Search"
              className="w-full bg-transparent border-none focus:ring-0 p-3 pl-12 pr-4 text-gray-100 placeholder-gray-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newQuery = e.currentTarget.value.trim();
                  if (newQuery) {
                    window.location.href = `/search?q=${encodeURIComponent(newQuery)}`;
                  }
                }
              }}
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-600" />
          </div>
        </div>
      </div>

      {query ? (
        isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            <p className="mt-4 text-gray-500">Searching...</p>
          </div>
        ) : totalResults > 0 ? (
          <div>
            {/* Users Section */}
            {results.users.length > 0 && (
              <div className="border-b border-gray-800">
                <div className="p-4">
                  <h2 className="font-bold text-lg">People</h2>
                </div>
                <div>
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/${user.username}`}
                      className="flex items-center px-4 py-3 hover:bg-gray-900 transition border-b border-gray-800"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src={
                            user.avatarUrl ||
                            `https://api.randomx.ai/avatar/${user.username}`
                          }
                          alt={user.displayName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {user.displayName}
                        </p>
                        <p className="text-gray-500">@{user.username}</p>
                        {user.bio && (
                          <p className="text-gray-300 text-sm mt-1">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags Section */}
            {results.hashtags.length > 0 && (
              <div className="border-b border-gray-800">
                <div className="p-4">
                  <h2 className="font-bold text-lg">Hashtags</h2>
                </div>
                <div>
                  {results.hashtags.map((hashtag) => (
                    <Link
                      key={hashtag.id}
                      href={`/hashtag/${hashtag.name}`}
                      className="flex items-center px-4 py-3 hover:bg-gray-900 transition border-b border-gray-800"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                        <Hash className="w-6 h-6 text-brand" />
                      </div>
                      <div>
                        <p className="font-bold text-white">#{hashtag.name}</p>
                        <p className="text-gray-500">
                          {hashtag.postCount}{" "}
                          {hashtag.postCount === 1 ? "post" : "posts"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {results.posts.length > 0 && (
              <div>
                <div className="p-4">
                  <h2 className="font-bold text-lg">Posts</h2>
                </div>
                <div>
                  {results.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-700" />
            </div>
            <p className="mt-4 text-xl font-bold">No results found</p>
            <p className="mt-2 text-gray-500">
              We couldn't find anything matching "{query}"
            </p>
            <p className="mt-4 text-gray-500 text-sm max-w-md text-center">
              Try searching for something else or check your spelling.
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-700" />
          </div>
          <p className="mt-4 text-xl font-bold">Search for something</p>
          <p className="mt-2 text-gray-500">
            Try searching for people, hashtags, or posts
          </p>
        </div>
      )}
    </main>
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
      <div className="sticky top-0 z-[100] backdrop-blur-xl bg-black/80 border-b border-gray-800">
        <div className="flex items-center gap-6 p-4">
          <Link href="/home" className="rounded-full p-2 hover:bg-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Search</h1>
            <p className="text-gray-500 text-sm">Enter a search term</p>
          </div>
        </div>

        <div className="px-4 pb-4 relative">
          <div className="bg-gray-900 rounded-full relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent border-none focus:ring-0 p-3 pl-12 pr-4 text-gray-100 placeholder-gray-600"
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-700" />
        </div>
        <p className="mt-4 text-xl font-bold">Search for something</p>
        <p className="mt-2 text-gray-500">
          Try searching for people, hashtags, or posts
        </p>
      </div>
    </main>
  );
}

// Main page component with Suspense
export default function SearchPage() {
  return (
    <AppLayout>
      <Suspense fallback={<SearchLoading />}>
        <SearchContent />
      </Suspense>
    </AppLayout>
  );
}
