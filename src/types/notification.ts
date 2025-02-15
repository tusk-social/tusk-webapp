export type NotificationType = 'like' | 'repost' | 'follow' | 'mention' | 'reply';

export interface Notification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actor: {
    name: string;
    username: string;
    avatar?: string;
  };
  post?: {
    id: string;
    content: string;
    image?: string;
  };
} 