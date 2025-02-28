"use client";
import { useState } from "react";

export default function FollowButton({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);

  console.log(userId);
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-6 py-2 rounded-full font-bold transition ${
        isFollowing
          ? "bg-transparent border border-gray-600 hover:border-red-500 hover:text-red-500"
          : "bg-white text-black hover:bg-gray-200"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
