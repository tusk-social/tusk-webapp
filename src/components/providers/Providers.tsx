"use client";

import { MemeModalProvider } from "@/context/MemeModalContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <MemeModalProvider>{children}</MemeModalProvider>;
}
