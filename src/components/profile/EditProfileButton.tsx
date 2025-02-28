"use client";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import type { User } from "@/lib/types";
export default function EditProfileButton({ user }: { user: User }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 rounded-full border border-gray-600 font-bold hover:bg-white/5 transition"
      >
        Edit profile
      </button>

      {isModalOpen && (
        <EditProfileModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
