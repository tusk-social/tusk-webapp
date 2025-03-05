import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";

export function useNotifications(tab: "All" | "Mentions") {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (currentCursor?: string | null) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (tab === "Mentions") {
        params.append("type", "MENTION");
      }
      if (currentCursor) {
        params.append("cursor", currentCursor);
      }

      const response = await fetch(`/api/notifications?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      if (currentCursor) {
        setNotifications((prev) => [...prev, ...data.notifications]);
      } else {
        setNotifications(data.notifications);
      }

      setHasMore(data.hasMore);
      if (data.nextCursor) setCursor(data.nextCursor);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch notifications"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCursor(null); // Reset cursor when tab changes
    fetchNotifications();
  }, [tab]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(cursor);
    }
  };

  return {
    notifications,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
