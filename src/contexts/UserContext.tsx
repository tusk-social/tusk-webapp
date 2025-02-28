"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Define the User type
export type User = {
  id: string;
  displayName: string;
  username: string;
  walletAddress: string;
  avatarUrl: string | null;
  profileBannerUrl: string | null;
  followersCount: number;
  followingCount: number;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// Define the context type
type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  logout: () => void;
};

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch the user data
  const fetchUser = async (force = false) => {
    // If we already have user data and we're not forcing a refresh, do nothing
    if (user && !force) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching current user data from /api/users/me");
      const response = await fetch("/api/users/me");
      console.log("API response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("User not found in database");
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (response.status === 401) {
          console.log("Unauthorized - No valid token");
          setUser(null);
          setIsLoading(false);
          return;
        }

        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      console.log("User data retrieved:", userData);
      setUser(userData);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "An error occurred while fetching user data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refetch the user data
  const refetchUser = async () => {
    await fetchUser(true);
  };

  // Function to handle logout
  const logout = () => {
    // Clear the access_token cookie
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    router.push("/");
  };

  // Fetch user data on mount
  useEffect(() => {
    console.log("UserProvider mounted, fetching user data");
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, refetchUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
