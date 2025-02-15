'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = ["All", "Mentions"];

export default function NotificationTabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
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