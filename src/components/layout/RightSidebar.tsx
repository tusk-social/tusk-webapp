"use client";
import { Search, X } from "lucide-react";
import TrendingTopics from "@/components/timeline/TrendingTopics";
import WhoToFollow from "@/components/timeline/WhoToFollow";
import Footer from "@/components/layout/Footer";
import { memo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

const SearchInput = memo(() => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    users: any[];
    hashtags: any[];
  }>({ users: [], hashtags: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          // Fetch users
          const usersResponse = await fetch(
            `/api/users/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`,
          );

          // Fetch hashtags
          const hashtagsResponse = await fetch(
            `/api/hashtags/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`,
          );

          if (usersResponse.ok && hashtagsResponse.ok) {
            const usersData = await usersResponse.json();
            const hashtagsData = await hashtagsResponse.json();

            setSuggestions({
              users: usersData.users || [],
              hashtags: hashtagsData.hashtags || [],
            });
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions({ users: [], hashtags: [] });
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsLoading(true);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions({ users: [], hashtags: [] });
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="sticky top-0 pb-3 bg-black">
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-gray-900 rounded-full relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            placeholder="Search"
            className="w-full bg-transparent border-none focus:ring-0 p-3 pl-12 pr-10 text-gray-100 placeholder-gray-600"
          />
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-600" />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute mt-2 w-full bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <span className="inline-block animate-spin mr-2">⭮</span>
                Searching...
              </div>
            ) : (
              <>
                {suggestions.users.length === 0 &&
                suggestions.hashtags.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                ) : (
                  <>
                    {/* Users section */}
                    {suggestions.users.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-800">
                          People
                        </div>
                        {suggestions.users.map((user) => (
                          <Link
                            key={user.id}
                            href={`/${user.username}`}
                            className="flex items-center px-4 py-3 hover:bg-gray-800 transition"
                            onClick={() => setShowSuggestions(false)}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <Image
                                src={
                                  user.avatarUrl ||
                                  `https://api.randomx.ai/avatar?seed=${user.username}`
                                }
                                alt={user.displayName}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                {user.displayName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                @{user.username}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Hashtags section */}
                    {suggestions.hashtags.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-800">
                          Hashtags
                        </div>
                        {suggestions.hashtags.map((hashtag) => (
                          <Link
                            key={hashtag.id}
                            href={`/hashtag/${hashtag.name}`}
                            className="flex items-center px-4 py-3 hover:bg-gray-800 transition"
                            onClick={() => setShowSuggestions(false)}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                              <span className="text-brand font-bold">#</span>
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                #{hashtag.name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {hashtag.postCount} posts
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* View all results link */}
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="block px-4 py-3 text-center text-brand hover:bg-gray-800 transition border-t border-gray-800"
                      onClick={() => setShowSuggestions(false)}
                    >
                      View all results for "{query}"
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
});

SearchInput.displayName = "SearchInput";

function RightSidebar() {
  return (
    <div className="w-[350px] sticky top-0 h-screen overflow-y-auto px-4 py-3 hidden lg:block right-sidebar">
      <SearchInput />
      <TrendingTopics />
      <WhoToFollow />
      <Footer />
    </div>
  );
}

export default memo(RightSidebar);
