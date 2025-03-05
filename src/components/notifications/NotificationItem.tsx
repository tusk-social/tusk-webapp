import { Notification } from "@/types/notification";
import { Heart, MessageCircle, Repeat2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "LIKE":
        return <Heart className="w-6 h-6 text-pink-500" />;
      case "REPOST":
        return <Repeat2 className="w-6 h-6 text-green-500" />;
      case "FOLLOW":
        return <User className="w-6 h-6 text-brand" />;
      case "MENTION":
      case "REPLY":
        return <MessageCircle className="w-6 h-6 text-brand" />;
    }
  };

  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const getPostLink = () => {
    if (!notification.post) return "";

    // Debug log to check notification data
    console.log("Notification type:", notification.type);
    console.log("Post data:", notification.post);

    if (notification.type === "REPLY") {
      console.log(
        "Is reply notification, parentId:",
        notification.post.parentId,
      );
      console.log("Parent username:", notification.post.parentUsername);

      if (notification.post.parentId && notification.post.parentUsername) {
        const parentLink = `/${notification.post.parentUsername}/status/${notification.post.parentId}`;
        console.log("Generated parent link:", parentLink);
        return parentLink;
      }
    }

    const postLink = `/${notification.actor.username}/status/${notification.post.id}`;
    console.log("Generated post link:", postLink);
    return postLink;
  };

  return (
    <div
      className={`flex p-4 space-x-4 hover:bg-white/[0.02] transition relative ${
        !notification.isRead ? "bg-brand/5" : ""
      }`}
    >
      <div className="w-12 flex-shrink-0 flex items-start justify-center">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start space-x-3">
          <Link
            href={`/${notification.actor.username}`}
            className="group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gray-800 relative overflow-hidden group-hover:ring-2 group-hover:ring-brand">
              {notification.actor.avatar && (
                <Image
                  src={notification.actor.avatar}
                  alt={`${notification.actor.displayName}'s profile picture`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-x-2 mb-0.5">
              <div className="flex-1 min-w-0 flex items-baseline gap-x-1">
                <Link
                  href={`/${notification.actor.username}`}
                  className="font-bold hover:underline truncate"
                >
                  {notification.actor.displayName}
                </Link>
                <span className="text-gray-300 truncate">
                  {notification.type === "LIKE" && "liked your post"}
                  {notification.type === "REPOST" && "reposted your post"}
                  {notification.type === "FOLLOW" && "followed you"}
                  {notification.type === "MENTION" && "mentioned you"}
                  {notification.type === "REPLY" && "replied to your post"}
                </span>
              </div>
              <span className="text-gray-500 text-sm flex-shrink-0">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {notification.post && (
          <div className="mt-2 ml-13">
            <Link
              href={getPostLink()}
              className="block text-gray-500 hover:text-gray-300 transition-colors"
            >
              <p className="line-clamp-2">{notification.post.content}</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
