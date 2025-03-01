"use client";
import Image from "next/image";
import { WHO_TO_FOLLOW } from "@/services/mockData";
import { memo, useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const UserToFollow = memo(
  ({
    user,
    onFade,
  }: {
    user: {
      id: number;
      name: string;
      username: string;
      avatar: string;
      userId?: string; // Add userId for real API calls
    };
    onFade: () => void;
  }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check follow status if we have a real userId
    useEffect(() => {
      if (user.userId) {
        const checkFollowStatus = async () => {
          try {
            const response = await fetch(
              `/api/follow/status?targetId=${user.userId}`,
            );
            if (response.ok) {
              const data = await response.json();
              setIsFollowing(data.isFollowing);
            }
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        };

        checkFollowStatus();
      }
    }, [user.userId]);

    const handleFollowToggle = async (e: React.MouseEvent) => {
      e.stopPropagation();

      // If we have a real userId, use the API
      if (user.userId) {
        if (isLoading) return;

        setIsLoading(true);
        try {
          const response = await fetch("/api/follow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              targetId: user.userId,
              action: isFollowing ? "unfollow" : "follow",
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update follow status");
          }

          // Toggle the following state
          setIsFollowing(!isFollowing);

          // Show success message
          toast.success(
            isFollowing ? "Unfollowed successfully" : "Following successfully",
          );

          // If now following, fade out
          if (!isFollowing) {
            setIsFading(true);
            setTimeout(() => {
              setIsFading(false);
              onFade();
            }, 1000);
          }
        } catch (error: any) {
          console.error("Follow error:", error);
          toast.error(error.message || "Something went wrong");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Mock behavior for demo users
        setIsFollowing((prev) => !prev);
        if (!isFollowing) {
          setIsFading(true);
          setTimeout(() => {
            setIsFading(false);
            onFade();
          }, 1000);
        }
      }
    };

    // Apply fade-out effect
    const userClass = `px-4 py-3 transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"} hover:bg-white/[0.03] cursor-pointer flex items-center justify-between`;

    return (
      <div className={userClass}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
            <Image
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              width={40}
              height={40}
            />
          </div>
          <div>
            <p className="font-bold text-base">{user.name}</p>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>
        </div>
        <button
          className={`px-4 py-1.5 rounded-full font-bold text-sm transition ${
            isFollowing
              ? "bg-transparent border border-gray-600 text-white hover:border-red-500 hover:text-red-500"
              : "bg-white text-black hover:bg-white/90"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handleFollowToggle}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block animate-spin mr-1">⭮</span>
          ) : null}
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    );
  },
);

UserToFollow.displayName = "UserToFollow";

function WhoToFollow() {
  const [users, setUsers] = useState(WHO_TO_FOLLOW);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch suggested users to follow
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await fetch("/api/users/suggested");
        if (response.ok) {
          const data = await response.json();
          setSuggestedUsers(
            data.users.map((user: any) => ({
              id: user.id,
              userId: user.id, // Real user ID for API calls
              name: user.displayName,
              username: user.username,
              avatar:
                user.avatarUrl ||
                `https://api.randomx.ai/avatar/${user.username}`,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleUserFade = (userId: number) => {
    // For mock data
    setUsers((prevUsers) => {
      const remainingUsers = prevUsers.filter((user) => user.id !== userId);
      const newUser = { ...remainingUsers[0], id: Math.random() }; // Simulate fetching a new user
      return [...remainingUsers.slice(1), newUser];
    });

    // For real data
    setSuggestedUsers((prevUsers) => {
      return prevUsers.filter((user) => user.id !== userId);
    });
  };

  // Display suggested users if available, otherwise show mock data
  const displayUsers = suggestedUsers.length > 0 ? suggestedUsers : users;

  // Memoize the mapped users to prevent unnecessary re-renders
  const userItems = useMemo(
    () =>
      displayUsers.map((user) => (
        <UserToFollow
          key={user.id}
          user={user}
          onFade={() => handleUserFade(user.id)}
        />
      )),
    [displayUsers],
  );

  return (
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">Who to follow</h2>
      <div>
        {isLoading ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <span className="inline-block animate-spin mr-2">⭮</span>
            Loading suggestions...
          </div>
        ) : userItems.length > 0 ? (
          userItems
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            No suggestions available
          </div>
        )}
        <button className="w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl">
          Show more
        </button>
      </div>
    </div>
  );
}

export default memo(WhoToFollow);
