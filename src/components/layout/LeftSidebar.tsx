"use client";
import { Bell, Bookmark, Home, Search, User, PenSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

const menuItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  // { icon: Mail, label: "Messages", href: "/messages" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: User, label: "Profile", href: "/profile" },
];

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

  const checkHealthEndpoint = async () => {
    try {
      for (let i = 0; i < 1000; i++) {
        console.log("Calling health API endpoint...");
        fetch("/api/health").then((res) =>
          res.json().then((data) => console.log("Health API response:", data)),
        );
      }
    } catch (error) {
      console.error("Error calling health API:", error);
    }
  };

  const navItems = useMemo(
    () =>
      menuItems.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          isActive={pathname === item.href}
        />
      )),
    [pathname],
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

        {/* Post Button - Added onClick handler */}
        <button
          className="w-[90%] bg-brand hover:bg-brand/90 text-white px-6 py-4 rounded-full font-bold text-lg transition mt-4 relative group"
          onClick={checkHealthEndpoint}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <PenSquare className="w-5 h-5" />
            <span>Post</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand via-purple-400 to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* User Profile */}
        <div className="mt-auto mb-4">
          <button className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-bold">Levan</div>
              <div className="text-gray-500 text-sm">@blockcraft3r</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(LeftSidebar);
