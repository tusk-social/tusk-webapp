"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import MemeModal from "@/components/meme/MemeModal";

type MemeGeneratedCallback = (imageUrl: string) => void;

interface MemeModalContextType {
  openMemeModal: (onMemeGenerated: MemeGeneratedCallback) => void;
  closeMemeModal: () => void;
}

const MemeModalContext = createContext<MemeModalContextType | undefined>(
  undefined,
);

export function useMemeModal() {
  const context = useContext(MemeModalContext);
  if (context === undefined) {
    throw new Error("useMemeModal must be used within a MemeModalProvider");
  }
  return context;
}

interface MemeModalProviderProps {
  children: ReactNode;
}

export function MemeModalProvider({ children }: MemeModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [onMemeGeneratedCallback, setOnMemeGeneratedCallback] =
    useState<MemeGeneratedCallback | null>(null);

  const openMemeModal = (callback: MemeGeneratedCallback) => {
    setOnMemeGeneratedCallback(() => callback);
    setIsOpen(true);
  };

  const closeMemeModal = () => {
    setIsOpen(false);
  };

  const handleMemeGenerated = (imageUrl: string) => {
    if (onMemeGeneratedCallback) {
      onMemeGeneratedCallback(imageUrl);
    }
    closeMemeModal();
  };

  return (
    <MemeModalContext.Provider value={{ openMemeModal, closeMemeModal }}>
      {children}
      {isOpen && (
        <MemeModal
          onMemeGenerated={handleMemeGenerated}
          onClose={closeMemeModal}
        />
      )}
    </MemeModalContext.Provider>
  );
}
