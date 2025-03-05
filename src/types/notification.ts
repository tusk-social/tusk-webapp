export type NotificationType =
  | "LIKE"
  | "REPOST"
  | "FOLLOW"
  | "MENTION"
  | "REPLY";

export interface Notification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    displayName: string;
    username: string;
    avatar?: string;
  };
  post?: {
    id: string;
    content: string;
    media?: any;
    createdAt: string;
    username: string;
    parentId?: string;
    parentUsername?: string;
  };
}
