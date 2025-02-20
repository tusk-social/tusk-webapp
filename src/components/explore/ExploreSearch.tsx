"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function ExploreSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full bg-gray-900 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand/50"
        />
      </div>
    </div>
  );
}
