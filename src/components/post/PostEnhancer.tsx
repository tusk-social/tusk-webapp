"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface PostEnhancerProps {
  content: string;
  onEnhanced: (enhancedContent: string) => void;
}

const STYLE_OPTIONS = [
  { value: "engaging", label: "Engaging" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "formal", label: "Formal" },
];

export default function PostEnhancer({
  content,
  onEnhanced,
}: PostEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("engaging");

  const enhancePost = async () => {
    if (!content.trim()) {
      setError("Please enter some content to enhance");
      return;
    }

    try {
      setIsEnhancing(true);
      setError(null);

      const response = await fetch("/api/enhance-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance post");
      }

      onEnhanced(data.enhancedPost);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative rounded-xl bg-gray-800/50 flex-1">
          <select
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none p-3 text-gray-100 appearance-none cursor-pointer"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            disabled={isEnhancing}
          >
            {STYLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} Style
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={enhancePost}
          disabled={isEnhancing || !content.trim()}
          className="flex items-center gap-2 bg-brand hover:bg-brand/90 text-white px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Enhance
            </>
          )}
        </button>
      </div>
    </div>
  );
}
