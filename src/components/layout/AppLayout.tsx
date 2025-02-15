import { ReactNode } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex max-w-[1300px] mx-auto">
        <LeftSidebar />
        {children}
        <RightSidebar />
      </div>
    </div>
  );
} 