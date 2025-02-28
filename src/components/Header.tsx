"use client";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import { Bell, Home, Search, User } from "lucide-react";

export default function Header() {
  const { isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/home" className="text-2xl font-bold text-white">
          <div className="w-8 h-8 relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/home" className="text-white hover:text-gray-300">
            <Home className="w-6 h-6" />
          </Link>
          <Link href="/explore" className="text-white hover:text-gray-300">
            <Search className="w-6 h-6" />
          </Link>
          <Link
            href="/notifications"
            className="text-white hover:text-gray-300"
          >
            <Bell className="w-6 h-6" />
          </Link>
          <Link href="/profile" className="text-white hover:text-gray-300">
            <User className="w-6 h-6" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
