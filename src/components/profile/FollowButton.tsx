"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FollowButton({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if the user is already following on component mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/follow/status?targetId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (userId) {
      checkFollowStatus();
    }
  }, [userId]);

  const handleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const endpoint = `/api/follow`;
      const method = "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId: userId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update follow status");
      }

      // Toggle the following state
      setIsFollowing(!isFollowing);

      // Show success message
      toast.success(
        isFollowing ? "Unfollowed successfully" : "Following successfully",
      );

      // Refresh the page to update follower counts
      router.refresh();
    } catch (error: any) {
      console.error("Follow error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-6 py-2 rounded-full font-bold transition ${
        isFollowing
          ? "bg-transparent border border-gray-600 hover:border-red-500 hover:text-red-500"
          : "bg-white text-black hover:bg-gray-200"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2">⭮</span>
      ) : null}
      {isFollowing
        ? isLoading
          ? "Updating..."
          : "Following"
        : isLoading
          ? "Following..."
          : "Follow"}
    </button>
  );
}
