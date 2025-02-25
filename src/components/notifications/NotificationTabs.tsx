'use client';

import { cn } from "@/lib/utils";

const tabs = ["All", "Mentions"] as const;

type Tab = (typeof tabs)[number];

interface NotificationTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function NotificationTabs({ activeTab, onTabChange }: NotificationTabsProps) {
  return (
    <div className="flex border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex-1 py-4 hover:bg-white/[0.03] transition relative",
            activeTab === tab && "font-bold"
          )}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
} 