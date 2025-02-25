"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ImageIcon, SmileIcon } from "lucide-react";
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
  type: 'text' | 'image';
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
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

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

  const handlePost = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Math.random().toString(36).substring(7),
      type: image ? 'image' : 'text',
      content: content.trim(),
      author: {
        name: 'Current User',
        username: 'currentuser',
        avatar: 'https://api.randomx.ai/avatar/currentuser'
      },
      createdAt: 'now',
      stats: {
        replies: 0,
        reposts: 0,
        likes: 0,
        views: 0
      },
      ...(image && { images: [image] })
    };

    onPost(newPost);
    setContent("");
    setImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
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
                    <span className={`text-sm ${content.length > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
                      {content.length}/{MAX_CHARS}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handlePost}
                disabled={!content.trim() || content.length > MAX_CHARS}
                className="bg-brand px-4 py-1.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand/90 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEmojiPicker && createPortal(
        <div
          ref={emojiPickerRef}
          style={{
            position: 'absolute',
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
          />
        </div>,
        document.body
      )}
    </div>
  );
}
