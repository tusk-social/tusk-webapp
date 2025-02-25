'use client';

import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
} 