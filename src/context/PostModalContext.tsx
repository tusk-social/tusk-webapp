"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import CreatePost from "@/components/timeline/CreatePost";
import { Post } from "@/types/post";
import { toast } from "react-hot-toast";

interface PostModalContextType {
  openPostModal: () => void;
  closePostModal: () => void;
  isPostModalOpen: boolean;
}

const PostModalContext = createContext<PostModalContextType | undefined>(
  undefined,
);

export function PostModalProvider({ children }: { children: ReactNode }) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);

  const handlePost = (post: Post) => {
    // Close the modal
    closePostModal();

    // Show success notification
    toast.success("Post created successfully!");

    // Refresh the page to show the new post
    // In a production app, you might want to use a more sophisticated approach
    // like using SWR or React Query to revalidate data
    window.location.reload();
  };

  return (
    <PostModalContext.Provider
      value={{
        openPostModal,
        closePostModal,
        isPostModalOpen,
      }}
    >
      {children}

      <Modal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        title="Create a post"
      >
        <CreatePost onPost={handlePost} />
      </Modal>
    </PostModalContext.Provider>
  );
}

export const usePostModal = () => {
  const context = useContext(PostModalContext);
  if (context === undefined) {
    throw new Error("usePostModal must be used within a PostModalProvider");
  }
  return context;
};
