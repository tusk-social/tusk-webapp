import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import PostList from "@/components/timeline/PostList";
import AppLayout from "@/components/layout/AppLayout";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import EditProfileButton from "@/components/profile/EditProfileButton";
import FollowButton from "@/components/profile/FollowButton";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const username = (await params).username;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  // Get the current user to check if this is the user's own profile
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === user.id;

  // Format the joined date
  const joinedDate = formatDate(user.createdAt);

  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <div className="flex items-center gap-6 px-4 py-2">
            <Link
              href="/home"
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{user.displayName}</h1>
              <p className="text-sm text-gray-500">1,234 posts</p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-48 bg-gray-800 relative">
          {user.profileBannerUrl && (
            <Image
              src={user.profileBannerUrl}
              alt="Profile banner"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-black bg-gray-800 overflow-hidden">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 text-4xl font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Follow/Edit Button */}
          <div className="flex justify-end pt-4">
            {isOwnProfile ? (
              <EditProfileButton user={user} />
            ) : (
              <FollowButton userId={user.id} />
            )}
          </div>

          {/* User Info */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-gray-500">@{user.username}</p>

            {user.bio && <p className="mt-4 whitespace-pre-wrap">{user.bio}</p>}

            <div className="flex flex-wrap gap-4 mt-4 text-gray-500">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.websiteUrl && (
                <a
                  href={user.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{user.websiteUrl}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="hover:underline">
                <span className="font-bold">{user.followingCount}</span>{" "}
                <span className="text-gray-500">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{user.followersCount}</span>{" "}
                <span className="text-gray-500">Followers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="flex">
            <button className="flex-1 px-4 py-4 text-brand font-bold border-b-2 border-brand hover:bg-white/5">
              Posts
            </button>
            <button className="flex-1 px-4 py-4 text-gray-500 hover:bg-white/5 hover:text-white">
              Replies
            </button>
            <button className="flex-1 px-4 py-4 text-gray-500 hover:bg-white/5 hover:text-white">
              Media
            </button>
            <button className="flex-1 px-4 py-4 text-gray-500 hover:bg-white/5 hover:text-white">
              Likes
            </button>
          </nav>
        </div>

        {/* Posts */}
        <PostList />
      </main>
    </AppLayout>
  );
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
