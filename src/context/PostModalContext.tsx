"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import CreatePost from "@/components/timeline/CreatePost";
import { Post } from "@/types/post";

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
    // Here you would typically call an API to create the post
    console.log("New post created:", post);

    // For now, we'll just close the modal
    closePostModal();

    // You could also add a toast notification here to confirm the post was created
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

export function usePostModal() {
  const context = useContext(PostModalContext);
  if (context === undefined) {
    throw new Error("usePostModal must be used within a PostModalProvider");
  }
  return context;
}
