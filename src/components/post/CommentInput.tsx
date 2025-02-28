"use client";

import { useState, useRef, useEffect } from "react";
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

interface CommentInputProps {
  onSubmit: (content: string, image: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export default function CommentInput({
  onSubmit,
  isSubmitting,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
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

  const handleSubmitComment = async () => {
    if (!content.trim() && !image) return;
    if (content.length > MAX_CHARS) return;

    await onSubmit(content, image);
    setContent("");
    setImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmitComment();
    }
  };

  return (
    <div className="p-4 flex items-start space-x-4">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 relative overflow-hidden">
        <Image
          src="https://api.randomx.ai/avatar/currentuser"
          alt="Your avatar"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-4">
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Post your reply"
          className="w-full bg-transparent border-b border-gray-800 focus:border-brand resize-none outline-none min-h-[80px] placeholder-gray-600"
          maxLength={MAX_CHARS}
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
              unoptimized // Since we're dealing with local blob URLs
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-brand hover:text-brand/90 transition p-2"
              aria-label="Upload image"
              disabled={isSubmitting}
            >
              <ImageIcon size={20} className="align-middle" />
            </button>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isSubmitting}
            />

            <div className="relative">
              <button
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-brand hover:text-brand/90 transition p-2"
                aria-label="Add emoji"
                disabled={isSubmitting}
              >
                <SmileIcon size={20} className="align-middle" />
              </button>
              {showEmojiPicker &&
                createPortal(
                  <div
                    ref={emojiPickerRef}
                    style={{
                      position: "absolute",
                      top: `${pickerPosition.top}px`,
                      left: `${pickerPosition.left}px`,
                      transform: "translateX(-50%)",
                      zIndex: 9999,
                    }}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: EmojiPickerData) => {
                        setContent((prev) => prev + emoji.native);
                        setShowEmojiPicker(false);
                      }}
                      theme="dark"
                      previewPosition="none"
                    />
                  </div>,
                  document.body,
                )}
            </div>

            <span
              className={`text-sm ${
                content.length > MAX_CHARS
                  ? "text-red-500"
                  : content.length > MAX_CHARS * 0.8
                    ? "text-yellow-500"
                    : "text-gray-500"
              }`}
            >
              {content.length}/{MAX_CHARS}
            </span>
          </div>

          <button
            onClick={handleSubmitComment}
            disabled={
              isSubmitting ||
              content.length > MAX_CHARS ||
              (!content.trim() && !image)
            }
            className="bg-brand hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed 
              text-white px-4 py-1.5 rounded-full font-medium transition flex items-center"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin mr-2">⭮</span>
            ) : null}
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
