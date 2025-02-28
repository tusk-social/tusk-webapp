"use client";
import {
  Bell,
  Bookmark,
  Home,
  Search,
  User,
  PenSquare,
  LogOut,
  Copy,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo, useMemo, useState, useRef, useEffect } from "react";
import { usePostModal } from "@/context/PostModalContext";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import toast from "react-hot-toast";

// Extract NavItem into a separate component
const NavItem = memo(
  ({
    item,
    isActive,
  }: {
    item: {
      icon: React.ElementType;
      label: string;
      href: string;
    };
    isActive: boolean;
  }) => {
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center text-xl p-3 rounded-full transition-all duration-200 group",
          "hover:bg-gray-900",
          isActive && "font-bold text-brand",
        )}
      >
        <div className="flex items-center gap-4 xl:gap-6">
          <div className="relative">
            <Icon
              className={cn(
                "w-6 h-6 transition-colors",
                "group-hover:text-brand",
                isActive && "text-brand",
              )}
            />
            {item.label === "Notifications" && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                3
              </span>
            )}
          </div>
          <span className="text-lg">{item.label}</span>
        </div>
      </Link>
    );
  },
);

NavItem.displayName = "NavItem";

function LeftSidebar() {
  const pathname = usePathname();
  const { openPostModal } = usePostModal();
  const { user, logout } = useUser();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [
      { icon: Home, label: "Home", href: "/home" },
      { icon: Search, label: "Explore", href: "/explore" },
      { icon: Bell, label: "Notifications", href: "/notifications" },
      { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
      {
        icon: User,
        label: "Profile",
        href: user?.username ? `/${user.username}` : "/home",
      },
    ],
    [user?.username],
  );

  // Function to shorten wallet address
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);

      // Use toast instead of alert
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Wallet address copied!</span>
        </div>,
        {
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
          duration: 2000,
        },
      );
    }
  };

  const navItems = useMemo(
    () =>
      menuItems.map((item) => (
        <NavItem
          key={`${item.href}-${item.label}`}
          item={item}
          isActive={
            item.label === "Profile" && user?.username
              ? pathname === `/${user.username}`
              : pathname === item.href
          }
        />
      )),
    [pathname, menuItems, user?.username],
  );

  return (
    <div className="w-[275px] h-screen sticky top-0 flex flex-col px-2 lg:flex hidden">
      <div className="flex flex-col flex-1 gap-2">
        {/* Logo */}
        <Link href="/home" className="p-4 hover:opacity-80 transition-opacity">
          <div className="relative w-8 h-8">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-brand via-purple-400 to-brand animate-gradient" />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">
              T
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 mt-2">{navItems}</nav>

        {/* Post Button - Updated to use the PostModalContext */}
        <button
          className="w-[90%] bg-brand hover:bg-brand/90 text-white px-6 py-4 rounded-full font-bold text-lg transition mt-4 relative group"
          onClick={openPostModal}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <PenSquare className="w-5 h-5" />
            <span>Post</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand via-purple-400 to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* User Profile with Popover */}
        <div className="mt-auto mb-4 relative">
          <button
            className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors"
            onClick={() => setShowPopover(!showPopover)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-lg font-bold">
                  {user?.displayName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">
                {user?.displayName || "Loading..."}
              </div>
              <div className="text-gray-500 text-sm">
                @{user?.username || "..."}
              </div>
            </div>
          </button>

          {/* Popover */}
          {showPopover && (
            <div
              ref={popoverRef}
              className="absolute bottom-full left-0 mb-2 w-full bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-800">
                <div className="font-bold text-lg">{user?.displayName}</div>
                <div className="text-gray-400">@{user?.username}</div>
                <div className="mt-2 flex items-center gap-2 text-gray-400 text-sm">
                  <span>{shortenAddress(user?.walletAddress || "")}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-gray-800 rounded-full"
                    title="Copy wallet address"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-800 transition-colors text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(LeftSidebar);
