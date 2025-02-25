'use client';

import AppLayout from "@/components/layout/AppLayout";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationTabs from "@/components/notifications/NotificationTabs";
import { useState } from "react";

// Using the sample notifications from the original NotificationList component
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    isRead: false,
    createdAt: '2h',
    actor: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://api.randomx.ai/avatar/currentuser'
    },
    post: {
      id: '1',
      content: 'This is an amazing post!',
    }
  },
  {
    id: '4',
    type: 'mention',
    isRead: true,
    createdAt: '2d',
    actor: {
      name: 'Product Guru',
      username: 'prodguru',
      avatar: 'https://api.randomx.ai/avatar/currentuser'
    },
    post: {
      id: '4',
      content: 'Hey @username, what do you think about this?',
    }
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Mentions">("All");

  const filteredNotifications = activeTab === "All" 
    ? SAMPLE_NOTIFICATIONS
    : SAMPLE_NOTIFICATIONS.filter(notification => notification.type === 'mention');

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Notifications</h1>
          <NotificationTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />  
        </div>
        <NotificationList notifications={filteredNotifications} />
      </main>
    </AppLayout>
  );
} 