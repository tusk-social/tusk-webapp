'use client';

import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    isRead: false,
    createdAt: '2h',
    actor: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: '/avatars/john.jpg'
    },
    post: {
      id: '1',
      content: 'This is an amazing post!',
    }
  },
  {
    id: '2',
    type: 'repost',
    isRead: true,
    createdAt: '5h',
    actor: {
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: '/avatars/jane.jpg'
    },
    post: {
      id: '2',
      content: 'Check out this awesome project!',
    }
  },
  {
    id: '3',
    type: 'follow',
    isRead: false,
    createdAt: '1d',
    actor: {
      name: 'Tech Enthusiast',
      username: 'techlover',
      avatar: '/avatars/tech.jpg'
    }
  },
  {
    id: '4',
    type: 'mention',
    isRead: true,
    createdAt: '2d',
    actor: {
      name: 'Product Guru',
      username: 'prodguru',
      avatar: '/avatars/guru.jpg'
    },
    post: {
      id: '4',
      content: 'Hey @username, what do you think about this?',
    }
  }
];

export default function NotificationList() {
  return (
    <div>
      {SAMPLE_NOTIFICATIONS.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
} 