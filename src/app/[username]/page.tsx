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
import { postService } from "@/services/postService";
import { Suspense } from "react";
import { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function UserProfilePage({
  params,
  searchParams,
}: PageProps) {
  const { username } = await params;
  const { tab } = await searchParams;
  const activeTab = tab === "engaged" ? "engaged" : "posts";

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

  // Fetch user posts and replies
  const { posts: userPosts } = await postService.getUserPosts({
    username,
    type: "all",
    limit: 50,
  });

  // Filter posts (user's own posts without a parent)
  const posts = userPosts.filter((post) => post.parentPostId === null);

  // Get replies (posts with a parent)
  const replies = userPosts.filter((post) => post.parentPostId !== null);

  // Extract unique parent posts from replies (engaged posts)
  const engagedPosts: Post[] = [];
  const seenParentIds = new Set<string>();

  for (const reply of replies) {
    if (
      reply.parentPost &&
      !seenParentIds.has(reply.parentPost.id) &&
      reply.parentPost.user?.id !== user.id // Exclude user's own posts
    ) {
      seenParentIds.add(reply.parentPost.id);
      engagedPosts.push(reply.parentPost as Post);
    }
  }

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
              <p className="text-sm text-gray-500">{userPosts.length} posts</p>
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
              <EditProfileButton user={user} refreshPage={true} />
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
                  <span>
                    {user.websiteUrl
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                  </span>
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
            <Link
              href={`/${username}`}
              className={cn(
                "flex-1 px-4 py-4 text-center hover:bg-white/5",
                activeTab === "posts"
                  ? "text-brand font-bold border-b-2 border-brand"
                  : "text-gray-500 hover:text-white",
              )}
            >
              Posts
            </Link>
            <Link
              href={`/${username}?tab=engaged`}
              className={cn(
                "flex-1 px-4 py-4 text-center hover:bg-white/5",
                activeTab === "engaged"
                  ? "text-brand font-bold border-b-2 border-brand"
                  : "text-gray-500 hover:text-white",
              )}
            >
              Engaged Posts
            </Link>
          </nav>
        </div>

        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <PostList
            posts={(activeTab === "posts" ? posts : engagedPosts) as Post[]}
          />
        </Suspense>
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
