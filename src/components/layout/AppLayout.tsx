import { ReactNode } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { memo } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
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

export default memo(AppLayout);
