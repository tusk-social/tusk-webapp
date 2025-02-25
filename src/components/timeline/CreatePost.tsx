"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ImageIcon, SmileIcon, ImagePlayIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";
import { createPortal } from "react-dom";

const MAX_CHARS = 280;

// Add this type for emoji-mart
type EmojiPickerData = {
  native: string;
};

interface Post {
  id: string;
  type: "text" | "image";
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
  images?: string[];
}

interface CreatePostProps {
  onPost: (post: Post) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchResults, setGifSearchResults] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const gifSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showEmojiPicker && emojiButtonRef.current) {
      const buttonRect = emojiButtonRef.current.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const isMobile = window.innerWidth < 640;

      setPickerPosition({
        top: buttonRect.bottom + window.scrollY + 5,
        left: isMobile ? window.innerWidth / 2 : buttonCenter,
      });
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleResize = () => {
      if (showEmojiPicker && emojiButtonRef.current) {
        const buttonRect = emojiButtonRef.current.getBoundingClientRect();
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        const isMobile = window.innerWidth < 640;

        setPickerPosition({
          top: buttonRect.bottom + window.scrollY + 5,
          left: isMobile ? window.innerWidth / 2 : buttonCenter,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showEmojiPicker]);

  // Fetch random GIFs initially
  useEffect(() => {
    fetchGifs("trending");
  }, []);

  const fetchGifs = async (query: string) => {
    if (!query) return;
    const response = await fetch(
      `https://g.tenor.com/v1/search?q=${query}&key=LIVDSRZULELA&limit=20`,
    );
    const data = await response.json();
    setGifSearchResults(
      data.results.map(
        (result: { media: { gif: { url: string } }[] }) =>
          result.media[0].gif.url,
      ),
    );
  };

  const debounce = <T extends (...args: string[]) => void>(
    func: T,
    delay: number,
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchGifs = debounce((query: string) => fetchGifs(query), 300);

  const handleGifSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFetchGifs(e.target.value);
  };

  const handleGifSelect = (gifUrl: string) => {
    setImage(null);
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
  };

  const handlePost = () => {
    if (!content.trim() && !selectedGif) return;

    const newPost: Post = {
      id: Math.random().toString(36).substring(7),
      type: image || selectedGif ? "image" : "text",
      content: content.trim(),
      author: {
        name: "Current User",
        username: "currentuser",
        avatar: "https://api.randomx.ai/avatar/currentuser",
      },
      createdAt: "now",
      stats: {
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0,
      },
      ...(image && { images: [image] }),
      ...(selectedGif && { images: [selectedGif] }),
    };

    onPost(newPost);
    setContent("");
    setImage(null);
    setSelectedGif(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedGif(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handlePost();
    }
  };

  const handleEmojiSelect = (emoji: EmojiPickerData) => {
    setContent((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-b border-gray-800 py-4 px-4 relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-purple-400/5 to-brand/5 blur-xl" />
      </div>

      <div className="relative z-10">
        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden">
            <Image
              src="https://api.randomx.ai/avatar/currentuser"
              alt="User avatar"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-4">
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-600 min-h-[72px]"
              placeholder="What's happening?"
              maxRows={8}
            />

            {image && (
              <div className="relative">
                <Image
                  src={image}
                  alt="Upload preview"
                  className="rounded-2xl max-h-[300px] object-contain"
                  width={600}
                  height={300}
                  unoptimized
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition"
                >
                  ×
                </button>
              </div>
            )}

            {selectedGif && (
              <div className="relative">
                <Image
                  src={selectedGif}
                  alt="GIF preview"
                  className="rounded-2xl max-h-[300px] object-contain"
                  width={600}
                  height={300}
                  unoptimized
                />
                <button
                  onClick={() => setSelectedGif(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <label className="p-2 hover:bg-brand/20 rounded-full transition cursor-pointer">
                  <ImageIcon className="w-5 h-5 text-brand" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                </label>
                <button
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-brand/20 rounded-full transition"
                >
                  <SmileIcon className="w-5 h-5 text-brand" />
                </button>

                {content.length > 0 && (
                  <div className="flex items-center">
                    <div className="w-[2px] h-6 mx-2 bg-gray-800" />
                    <span
                      className={`text-sm ${content.length > MAX_CHARS ? "text-red-500" : "text-gray-500"}`}
                    >
                      {content.length}/{MAX_CHARS}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  className="p-2 hover:bg-brand/20 rounded-full transition"
                >
                  <ImagePlayIcon className="w-5 h-5 text-brand" />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={
                  (!content.trim() && !selectedGif) ||
                  content.length > MAX_CHARS
                }
                className="bg-brand px-4 py-1.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand/90 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEmojiPicker &&
        createPortal(
          <div
            ref={emojiPickerRef}
            style={{
              position: "absolute",
              top: `${pickerPosition.top}px`,
              left: `${pickerPosition.left}px`,
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
            />
          </div>,
          document.body,
        )}

      {showGifPicker &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setShowGifPicker(false)}
          >
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 101,
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                width: "90%",
                maxWidth: "500px",
                maxHeight: "80vh",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Search GIFs
                </h3>
                <button
                  onClick={() => setShowGifPicker(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                  aria-label="Close GIF picker"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search GIFs"
                  ref={gifSearchInputRef}
                  onChange={handleGifSearchChange}
                  autoFocus
                  className="w-full p-3 bg-gray-700/50 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder-gray-400 transition-all"
                  style={{
                    backdropFilter: "blur(4px)",
                  }}
                />
              </div>

              <div
                className="overflow-y-auto flex-1 pr-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4b5563 #1f2937",
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {gifSearchResults.map((gifUrl) => (
                    <Image
                      key={gifUrl}
                      src={gifUrl}
                      alt="GIF"
                      className="cursor-pointer rounded-lg object-cover w-full h-32 hover:opacity-90 transition-opacity"
                      onClick={() => handleGifSelect(gifUrl)}
                      width={150}
                      height={128}
                      unoptimized
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
