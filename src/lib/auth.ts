"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function useAuth() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token="),
    );

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      const decoded = decodeJwt(token);

      if (decoded?.properties?.id) {
        setUserId(decoded.properties.id);
      } else {
        router.push("/_chopin/login");
      }
    } else {
      router.push("/_chopin/login");
    }

    setIsLoading(false);
  }, [router]);

  return { userId, isLoading };
}
