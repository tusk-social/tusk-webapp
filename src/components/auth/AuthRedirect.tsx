"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function AuthRedirect() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User exists, redirect to home feed
        router.push("/home");
      } else if (error) {
        // Error occurred, redirect to login
        router.push("/_chopin/login");
      } else {
        // User doesn't exist but we have a token (404 from /api/users/me)
        router.push("/auth/onboarding");
      }
    }
  }, [user, isLoading, error, router]);

  // Show loading state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <svg
          className="animate-spin h-12 w-12 text-brand mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-xl text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
