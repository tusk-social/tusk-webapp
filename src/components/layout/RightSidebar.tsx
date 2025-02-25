"use client";
import { Search } from "lucide-react";
import TrendingTopics from "@/components/timeline/TrendingTopics";
import WhoToFollow from "@/components/timeline/WhoToFollow";
import Footer from "@/components/layout/Footer";
import { memo } from "react";

// Extract SearchInput into a separate component
const SearchInput = memo(() => (
  <div className="sticky top-0 pb-3 bg-black">
    <div className="bg-gray-900 rounded-full">
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent border-none focus:ring-0 p-3 pl-12 text-gray-100 placeholder-gray-600"
      />
      <Search className="w-5 h-5 absolute left-3 top-3 text-gray-600" />
    </div>
  </div>
));

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
