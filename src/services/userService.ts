import { prisma } from "@/lib/db";

type User = {
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
  createdAt: Date;
  updatedAt: Date;
  deactivatedAt: Date | null;
};

export type CreateUserData = {
  displayName: string;
  username: string;
  walletAddress: string;
  avatarUrl?: string;
  profileBannerUrl?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
};

export type UpdateUserData = Partial<CreateUserData>;

export const userService = {
  // Create a new user
  async createUser(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Get user by wallet ID
  async getUserByWalletId(walletAddress: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { walletAddress },
    });
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  // Get user by wallet address
  async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { walletAddress },
    });
  },

  // Update user
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // Deactivate user
  async deactivateUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deactivatedAt: new Date() },
    });
  },

  // Reactivate user
  async reactivateUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deactivatedAt: null },
    });
  },

  // Increment followers count
  async incrementFollowersCount(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        followersCount: {
          increment: 1,
        },
      },
    });
  },

  // Decrement followers count
  async decrementFollowersCount(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    });
  },

  // Increment following count
  async incrementFollowingCount(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });
  },

  // Decrement following count
  async decrementFollowingCount(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    });
  },

  // List users with pagination
  async listUsers(
    page: number = 1,
    limit: number = 10,
    where: any = {},
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },

  // Search users
  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const where = {
      OR: [
        { displayName: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { walletAddress: { contains: query, mode: "insensitive" } },
      ],
      deactivatedAt: null, // Only active users
    };

    return this.listUsers(page, limit, where);
  },
};
