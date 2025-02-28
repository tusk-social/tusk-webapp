/**
 * Type definitions for the application
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  walletAddress: string;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  avatarUrl: string | null;
  profileBannerUrl: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}
