import { useEffect, useState } from "react";

export function useUnreadNotifications() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCount() {
      try {
        const response = await fetch("/api/notifications/unread/count");
        if (!response.ok) throw new Error("Failed to fetch notification count");
        const data = await response.json();
        if (mounted) setCount(data.count);
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Initial fetch
    fetchCount();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchCount, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { count, loading, error };
}
