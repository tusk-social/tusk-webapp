"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  ImageIcon,
  SmileIcon,
  ImagePlayIcon,
  Laugh,
  Sparkles,
  Loader2,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useMemeModal } from "@/context/MemeModalContext";
import { toast } from "react-hot-toast";
import Tooltip from "@/components/ui/Tooltip";
import { Post } from "@/types/post";

const MAX_CHARS = 280;

// Add this type for emoji-mart
type EmojiPickerData = {
  native: string;
};

interface CreatePostProps {
  onPost: (post: Post) => void;
  parentPostId?: string;
  repostPostId?: string;
}

interface MentionUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

export default function CreatePost({
  onPost,
  parentPostId,
  repostPostId,
}: CreatePostProps) {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { openMemeModal } = useMemeModal();

  // Mentions state
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionUser[]>(
    [],
  );
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const mentionSuggestionsRef = useRef<HTMLDivElement>(null);

  // Add new state variables for post enhancement and API interaction
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        mentionSuggestionsRef.current &&
        !mentionSuggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current !== event.target
      ) {
        setShowMentionSuggestions(false);
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

  // Handle mention suggestions
  useEffect(() => {
    if (mentionQuery && mentionQuery.length >= 2) {
      const fetchMentionSuggestions = async () => {
        try {
          console.log("Fetching mention suggestions for:", mentionQuery);
          const response = await fetch(
            `/api/users/mentions?q=${encodeURIComponent(mentionQuery)}&limit=5`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch mention suggestions");
          }

          const data = await response.json();
          console.log("Mention suggestions received:", data.users);
          setMentionSuggestions(data.users || []);
          setSelectedMentionIndex(0); // Reset selection to first item
        } catch (error) {
          console.error("Error fetching mention suggestions:", error);
          setMentionSuggestions([]);
        }
      };

      fetchMentionSuggestions();
    } else {
      setMentionSuggestions([]);
    }
  }, [mentionQuery]);

  // Position mention suggestions dropdown
  useEffect(() => {
    if (showMentionSuggestions && textareaRef.current) {
      console.log("Showing mention suggestions for query:", mentionQuery);

      const textarea = textareaRef.current;
      const textareaRect = textarea.getBoundingClientRect();

      // Simpler positioning approach - position below the textarea
      // with a slight offset from the left edge
      setMentionPosition({
        top: textareaRect.bottom + window.scrollY + 5,
        left: textareaRect.left + 20,
      });
    }
  }, [showMentionSuggestions, mentionQuery]);

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

  const handlePost = async () => {
    if (
      (!content.trim() && !selectedGif && !image) ||
      content.length > MAX_CHARS
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare media data if present
      let mediaData = null;
      if (image) {
        mediaData = { type: "image", url: image };
      } else if (selectedGif) {
        mediaData = { type: "gif", url: selectedGif };
      }

      // Call the API to create the post
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content.trim(),
          media: mediaData,
          parentPostId,
          repostPostId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const newPost = await response.json();

      // Call the onPost callback with the new post
      onPost(newPost);

      // Reset form state
      setContent("");
      setImage(null);
      setSelectedGif(null);

      // Show success message
      toast.success("Post created successfully!");
    } catch (err: any) {
      console.error("Error creating post:", err);
      setError(err.message || "Failed to create post");
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any selected GIF
    setSelectedGif(null);

    try {
      // Show loading state
      setIsSubmitting(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "post");

      // Upload the image to Vercel Blob
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();

      // Set the image URL from the response
      setImage(data.url);

      toast.success("Image uploaded successfully!", { duration: 3000 });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image", {
        duration: 3000,
      });
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handlePost();
      return;
    }

    // Handle mention suggestions navigation
    if (showMentionSuggestions && mentionSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < mentionSuggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev > 0 ? prev - 1 : mentionSuggestions.length - 1,
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleMentionSelect(mentionSuggestions[selectedMentionIndex].username);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionSuggestions(false);
      }
    }
  };

  const handleEmojiSelect = (emoji: EmojiPickerData) => {
    setContent((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // Validate content length
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
    }

    // Get cursor position
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Check for mention trigger
    const textBeforeCursor = newContent.substring(0, cursorPos);

    // Look for @ that is either at the start of text or preceded by whitespace
    const lastAtSymbolPos = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbolPos >= 0) {
      // Check if @ is at the beginning or has a space before it
      const isValidMentionStart =
        lastAtSymbolPos === 0 ||
        /\s/.test(textBeforeCursor.charAt(lastAtSymbolPos - 1));

      if (isValidMentionStart) {
        // Extract the query (text after @ up to cursor)
        const query = textBeforeCursor.substring(lastAtSymbolPos + 1);

        // Only show suggestions if we're not in the middle of a word
        const isMiddleOfWord =
          cursorPos < newContent.length &&
          /\w/.test(newContent.charAt(cursorPos));

        if (!isMiddleOfWord && /^\w*$/.test(query)) {
          console.log("Mention detected:", query);
          setMentionQuery(query);
          setShowMentionSuggestions(true);
          return;
        }
      }
    }

    // If we get here, no valid mention was found
    setShowMentionSuggestions(false);
  };

  const handleMentionSelect = (username: string) => {
    // Find the position of the @ symbol that started this mention
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lastAtSymbolPos = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbolPos >= 0) {
      // Replace everything from the @ to the cursor with the username
      const newContent =
        content.substring(0, lastAtSymbolPos) +
        `@${username} ` +
        content.substring(cursorPosition);

      setContent(newContent);

      // Set cursor position after the inserted mention
      const newCursorPos = lastAtSymbolPos + username.length + 2; // +2 for @ and space
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      }, 0);
    }

    setShowMentionSuggestions(false);
  };

  const handleMemeGenerated = (memeUrl: string) => {
    // Clear any existing image or GIF
    setImage(memeUrl);
    setSelectedGif(null);
  };

  // Simplified enhance function
  const enhancePost = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to enhance");
      return;
    }

    try {
      setIsEnhancing(true);
      console.log("Enhancing post with content:", content);

      const response = await fetch("/api/enhance-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance post");
      }

      if (data.enhancedPost) {
        console.log("Setting enhanced content:", data.enhancedPost);
        setContent(data.enhancedPost);
        toast.success("Post enhanced!");
      } else {
        throw new Error("No enhanced content returned");
      }
    } catch (err: any) {
      console.error("Enhancement error:", err);
      toast.error(
        "Failed to enhance post: " + (err.message || "Unknown error"),
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  // Define a common button style class
  const iconButtonClass =
    "p-2 hover:bg-brand/20 rounded-full transition inline-flex items-center justify-center";

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
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-600 min-h-[72px] ${showMentionSuggestions ? "mention-active" : ""}`}
              placeholder={
                parentPostId
                  ? "Write your reply..."
                  : repostPostId
                    ? "Add a comment..."
                    : "What's happening?"
              }
              maxRows={8}
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Tooltip text="Upload image">
                  <label
                    className={`${iconButtonClass} ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <ImageIcon className="w-5 h-5 text-brand" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      disabled={isSubmitting}
                    />
                  </label>
                </Tooltip>

                <Tooltip text="Add emoji">
                  <button
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={iconButtonClass}
                    disabled={isSubmitting}
                  >
                    <SmileIcon className="w-5 h-5 text-brand" />
                  </button>
                </Tooltip>

                <Tooltip text="Add GIF">
                  <button
                    onClick={() => setShowGifPicker(!showGifPicker)}
                    className={iconButtonClass}
                    disabled={isSubmitting}
                  >
                    <ImagePlayIcon className="w-5 h-5 text-brand" />
                  </button>
                </Tooltip>

                <Tooltip text="Create meme">
                  <button
                    onClick={() => openMemeModal(handleMemeGenerated)}
                    className={iconButtonClass}
                    disabled={isSubmitting}
                  >
                    <Laugh className="w-5 h-5 text-brand" />
                  </button>
                </Tooltip>

                <Tooltip text="Enhance with AI">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Enhance button clicked");
                      enhancePost();
                    }}
                    disabled={isEnhancing || !content.trim() || isSubmitting}
                    className={`${iconButtonClass} ${
                      isEnhancing || !content.trim() || isSubmitting
                        ? "text-gray-400"
                        : "text-brand hover:text-brand"
                    } relative`}
                  >
                    <Sparkles className="h-5 w-5" />
                    {isEnhancing && (
                      <span className="absolute -top-1 -right-1">
                        <Loader2 className="h-3 w-3 animate-spin text-brand" />
                      </span>
                    )}
                  </button>
                </Tooltip>

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
              </div>
              <button
                onClick={handlePost}
                disabled={
                  isSubmitting ||
                  (!content.trim() && !selectedGif && !image) ||
                  content.length > MAX_CHARS
                }
                className="bg-brand px-4 py-1.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand/90 transition flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
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

      {showMentionSuggestions &&
        createPortal(
          <div
            ref={mentionSuggestionsRef}
            style={{
              position: "fixed",
              top: `${mentionPosition.top}px`,
              left: `${mentionPosition.left}px`,
              zIndex: 100,
              backgroundColor: "#1f2937",
              borderRadius: "0.5rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              width: "300px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
            className="border border-gray-700"
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                Mentioning user:{" "}
                <span className="text-brand font-medium">
                  @{mentionQuery || "..."}
                </span>
              </div>
              {mentionSuggestions.length > 0 ? (
                mentionSuggestions.map((user, index) => (
                  <button
                    key={user.id}
                    data-username={user.username}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none transition-colors flex items-center space-x-3 ${index === selectedMentionIndex ? "bg-gray-800" : ""}`}
                    onClick={() => handleMentionSelect(user.username)}
                    onMouseEnter={() => setSelectedMentionIndex(index)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-gray-400 text-sm truncate">
                        @{user.username}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">
                  No users found
                </div>
              )}
            </div>
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
