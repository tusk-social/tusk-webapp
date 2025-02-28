"use client";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/lib/types";
import { X, Camera, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";

// Validation utilities
const sanitizeInput = (input: string): string => {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

const isValidUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { refetchUser } = useUser();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl,
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    user.profileBannerUrl,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    websiteUrl?: string;
    location?: string;
  }>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes with sanitization
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    setDisplayName(sanitized);

    // Clear error when user starts typing
    if (errors.displayName) {
      setErrors((prev) => ({ ...prev, displayName: undefined }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    setLocation(sanitized);

    // Clear error when user starts typing
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsiteUrl(value);

    // Clear error when user starts typing
    if (errors.websiteUrl) {
      setErrors((prev) => ({ ...prev, websiteUrl: undefined }));
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: {
      displayName?: string;
      websiteUrl?: string;
      location?: string;
    } = {};

    // Validate display name
    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    } else if (displayName.length > 20) {
      newErrors.displayName = "Display name must be at most 20 characters";
    }

    // Validate website URL
    if (websiteUrl && !isValidUrl(websiteUrl)) {
      newErrors.websiteUrl =
        "Please enter a valid URL (e.g., https://example.com)";
    }

    // Validate location (optional, but if provided, should be reasonable)
    if (location && location.length > 30) {
      newErrors.location = "Location must be less than 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // TO-DO: Handle file uploads
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("bio", sanitizeInput(bio));
      formData.append("location", location);
      formData.append("websiteUrl", websiteUrl);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Refetch user data to update the UI
      await refetchUser();

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 backdrop-blur-md bg-gray-900/90 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Edit profile</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-1.5 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Banner */}
          <div className="relative h-48 bg-gray-800">
            {bannerPreview && (
              <Image
                src={bannerPreview}
                alt="Profile banner"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition"
              >
                <Camera className="w-6 h-6" />
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="px-4 relative">
            <div className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-4xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="p-4 mt-16 space-y-4">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Name
              </label>
              <div
                className={`bg-gray-900 border border-gray-700 focus-within:border-brand ${errors.displayName ? "ring-1 ring-red-500" : ""}`}
                style={{ borderRadius: "6px" }}
              >
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  maxLength={20}
                  className="w-full bg-transparent border-none focus:ring-0 p-3 text-gray-100 placeholder-gray-600"
                  style={{ borderRadius: "6px" }}
                  placeholder="Your name"
                />
              </div>
              <div className="flex justify-between mt-1">
                <div>
                  {errors.displayName && (
                    <p className="text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                      <AlertCircle className="w-3 h-3" />
                      {errors.displayName}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">{displayName.length}/20</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Bio
              </label>
              <div
                className="bg-gray-900 border border-gray-700 focus-within:border-brand"
                style={{ borderRadius: "6px" }}
              >
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full bg-transparent border-none focus:ring-0 p-3 text-gray-100 placeholder-gray-600 resize-none"
                  style={{ borderRadius: "6px" }}
                  placeholder="Describe yourself"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">
                {bio.length}/160
              </p>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Location
              </label>
              <div
                className={`bg-gray-900 border border-gray-700 focus-within:border-brand ${errors.location ? "ring-1 ring-red-500" : ""}`}
                style={{ borderRadius: "6px" }}
              >
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  maxLength={30}
                  className="w-full bg-transparent border-none focus:ring-0 p-3 text-gray-100 placeholder-gray-600"
                  style={{ borderRadius: "6px" }}
                  placeholder="Where you're based"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3 h-3" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Website
              </label>
              <div
                className={`bg-gray-900 border border-gray-700 focus-within:border-brand ${errors.websiteUrl ? "ring-1 ring-red-500" : ""}`}
                style={{ borderRadius: "6px" }}
              >
                <input
                  type="url"
                  id="website"
                  value={websiteUrl}
                  onChange={handleWebsiteChange}
                  className="w-full bg-transparent border-none focus:ring-0 p-3 text-gray-100 placeholder-gray-600"
                  style={{ borderRadius: "6px" }}
                  placeholder="https://example.com"
                />
              </div>
              {errors.websiteUrl && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3 h-3" />
                  {errors.websiteUrl}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
