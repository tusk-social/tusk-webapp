"use client";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";

interface EditProfileButtonProps {
  user: User;
  refreshPage?: boolean;
}

export default function EditProfileButton({
  user,
  refreshPage = false,
}: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);

    // If refreshPage is true, refresh the current page to show updated data
    if (refreshPage) {
      router.refresh();
    }
  };

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
          onClose={handleClose}
        />
      )}
    </>
  );
}
