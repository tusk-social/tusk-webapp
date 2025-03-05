"use client";

import AppLayout from "@/components/layout/AppLayout";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationTabs from "@/components/notifications/NotificationTabs";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Mentions">("All");
  const { notifications, loading, error, hasMore, loadMore } =
    useNotifications(activeTab);

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Notifications</h1>
          <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-400">
            Failed to load notifications. Please try again.
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No notifications yet
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        )}
      </main>
    </AppLayout>
  );
}
