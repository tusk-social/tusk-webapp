import { prisma } from "@/lib/db";
import crypto from "crypto";

export interface CreateApiKeyParams {
  userId: string;
  name: string;
}

export interface ApiKeyWithoutSecret {
  id: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
}

export const apiKeyService = {
  /**
   * Generate a new API key for a user
   * Returns the API key secret that should be shown to the user only once
   */
  async createApiKey({
    userId,
    name,
  }: CreateApiKeyParams): Promise<{
    secret: string;
    key: ApiKeyWithoutSecret;
  }> {
    // Generate a secure random key
    const keyBuffer = crypto.randomBytes(32);
    const secret = `tsk_${keyBuffer.toString("base64url")}`;

    // Hash the key for storage
    const hashedKey = crypto.createHash("sha256").update(secret).digest("hex");

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        key: hashedKey,
        name,
      },
    });

    return {
      secret,
      key: {
        id: apiKey.id,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
        lastUsedAt: apiKey.lastUsedAt,
        isActive: apiKey.isActive,
      },
    };
  },

  /**
   * Get all API keys for a user (without the secret key)
   */
  async getApiKeys(userId: string): Promise<ApiKeyWithoutSecret[]> {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      isActive: key.isActive,
    }));
  },

  /**
   * Revoke an API key
   */
  async revokeApiKey(keyId: string, userId: string): Promise<void> {
    await prisma.apiKey.updateMany({
      where: {
        id: keyId,
        userId, // Ensure the key belongs to the user
      },
      data: {
        isActive: false,
      },
    });
  },

  /**
   * Validate an API key and return the associated user
   * Also updates the lastUsedAt timestamp
   */
  async validateApiKey(keySecret: string): Promise<string | null> {
    // Hash the provided key
    const hashedKey = crypto
      .createHash("sha256")
      .update(keySecret)
      .digest("hex");

    // Find the key and update lastUsedAt
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        key: hashedKey,
        isActive: true,
      },
      select: {
        userId: true,
      },
    });

    if (!apiKey) {
      return null;
    }

    // Update lastUsedAt
    await prisma.apiKey.updateMany({
      where: {
        key: hashedKey,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });

    return apiKey.userId;
  },
};
