import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import PostList from "@/components/timeline/PostList";
import AppLayout from "@/components/layout/AppLayout";

// This will be replaced with actual data fetching
const MOCK_USER = {
  name: "John Doe",
  username: "johndoe",
  avatar: "/avatars/john.jpg",
  banner: "/banners/default.jpg",
  bio: "Software engineer by day, dreamer by night 💫\nBuilding the future, one line of code at a time.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinedDate: "March 2024",
  following: 420,
  followers: 69,
};

export default function ProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;
  
  // In real app, fetch user data here
  const user = MOCK_USER;
  
  if (!user) {
    notFound();
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
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-500">1,234 posts</p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-48 bg-gray-800 relative">
          {user.banner && (
            <Image
              src={user.banner}
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
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Follow Button */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 rounded-full border border-gray-800 font-bold hover:bg-white/5 transition">
              Follow
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>

            <p className="mt-4 whitespace-pre-wrap">{user.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4 text-gray-500">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a 
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{new URL(user.website).hostname}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinedDate}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="hover:underline">
                <span className="font-bold">{user.following}</span>{" "}
                <span className="text-gray-500">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{user.followers}</span>{" "}
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