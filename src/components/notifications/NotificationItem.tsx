import { Notification } from "@/types/notification";
import { Heart, MessageCircle, Repeat2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-6 h-6 text-pink-500" />;
      case 'repost':
        return <Repeat2 className="w-6 h-6 text-green-500" />;
      case 'follow':
        return <User className="w-6 h-6 text-brand" />;
      case 'mention':
      case 'reply':
        return <MessageCircle className="w-6 h-6 text-brand" />;
    }
  };

  return (
    <Link 
      href={notification.post ? `/post/${notification.post.id}` : `/${notification.actor.username}`}
      className={`flex p-4 space-x-4 hover:bg-white/[0.02] transition relative ${
        !notification.isRead ? 'bg-brand/5' : ''
      }`}
    >
      <div className="w-12 flex-shrink-0 flex items-start justify-center">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 relative overflow-hidden">
            {notification.actor.avatar && (
              <Image
                src={notification.actor.avatar}
                alt={notification.actor.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <span className="font-bold hover:underline">
              {notification.actor.name}
            </span>
            <span className="text-gray-500">
              {' '}
              {notification.type === 'like' && 'liked your post'}
              {notification.type === 'repost' && 'reposted your post'}
              {notification.type === 'follow' && 'followed you'}
              {notification.type === 'mention' && 'mentioned you'}
              {notification.type === 'reply' && 'replied to your post'}
            </span>
          </div>
          <span className="text-gray-500 text-sm">{notification.createdAt}</span>
        </div>
        
        {notification.post && (
          <p className="text-gray-500">{notification.post.content}</p>
        )}
      </div>
    </Link>
  );
} 