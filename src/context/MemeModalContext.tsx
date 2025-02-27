"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import MemeGenerator from "@/components/meme/MemeGenerator";

interface MemeModalContextType {
  openMemeModal: (onImageGenerated: (imageUrl: string) => void) => void;
  closeMemeModal: () => void;
  isMemeModalOpen: boolean;
}

const MemeModalContext = createContext<MemeModalContextType | undefined>(
  undefined,
);

export function MemeModalProvider({ children }: { children: ReactNode }) {
  const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
  const [onImageGeneratedCallback, setOnImageGeneratedCallback] = useState<
    ((imageUrl: string) => void) | null
  >(null);

  const openMemeModal = (onImageGenerated: (imageUrl: string) => void) => {
    setOnImageGeneratedCallback(() => onImageGenerated);
    setIsMemeModalOpen(true);
  };

  const closeMemeModal = () => {
    setIsMemeModalOpen(false);
  };

  const handleMemeGenerated = (imageUrl: string) => {
    if (onImageGeneratedCallback) {
      onImageGeneratedCallback(imageUrl);
    }
    closeMemeModal();
  };

  return (
    <MemeModalContext.Provider
      value={{
        openMemeModal,
        closeMemeModal,
        isMemeModalOpen,
      }}
    >
      {children}

      <Modal
        isOpen={isMemeModalOpen}
        onClose={closeMemeModal}
        title="Create a Meme"
      >
        <MemeGenerator
          onMemeGenerated={handleMemeGenerated}
          onClose={closeMemeModal}
        />
      </Modal>
    </MemeModalContext.Provider>
  );
}

export function useMemeModal() {
  const context = useContext(MemeModalContext);
  if (context === undefined) {
    throw new Error("useMemeModal must be used within a MemeModalProvider");
  }
  return context;
}
