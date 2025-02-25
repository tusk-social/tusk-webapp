"use client";
import Image from "next/image";
import { WHO_TO_FOLLOW } from "@/services/mockData";
import { memo, useMemo, useState } from "react";

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
    };
    onFade: () => void;
  }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleFollowToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFollowing((prev) => !prev);
      if (!isFollowing) {
        setIsFading(true);
        setTimeout(() => {
          setIsFading(false);
          onFade();
        }, 1000);
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
          className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm hover:bg-white/90"
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    );
  },
);

UserToFollow.displayName = "UserToFollow";

function WhoToFollow() {
  const [users, setUsers] = useState(WHO_TO_FOLLOW);

  const handleUserFade = (userId: number) => {
    setUsers((prevUsers) => {
      const remainingUsers = prevUsers.filter((user) => user.id !== userId);
      const newUser = { ...remainingUsers[0], id: Math.random() }; // Simulate fetching a new user
      return [...remainingUsers.slice(1), newUser];
    });
  };

  // Memoize the mapped users to prevent unnecessary re-renders
  const userItems = useMemo(
    () =>
      users.map((user) => (
        <UserToFollow
          key={user.id}
          user={user}
          onFade={() => handleUserFade(user.id)}
        />
      )),
    [users],
  );

  return (
    <div className="bg-gray-900 rounded-2xl mt-4">
      <h2 className="font-bold text-xl px-4 pt-3 pb-2">Who to follow</h2>
      <div>
        {userItems}
        <button className="w-full text-left px-4 py-4 text-brand hover:bg-white/[0.03] transition rounded-b-2xl">
          Show more
        </button>
      </div>
    </div>
  );
}

export default memo(WhoToFollow);
