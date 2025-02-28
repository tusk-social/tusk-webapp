-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "profileBannerUrl" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "location" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deactivatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
