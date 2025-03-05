"use client";

import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";
import { useEffect, useRef } from "react";

interface NotificationListProps {
  notifications: Notification[];
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function NotificationList({
  notifications,
  hasMore,
  onLoadMore,
}: NotificationListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <div className="divide-y divide-gray-800">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center"
        >
          <div className="w-6 h-6 border-t-2 border-gray-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
