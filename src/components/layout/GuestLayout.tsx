import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex max-w-[1300px] mx-auto">
        {/* Empty Left Sidebar */}
        <div className="w-[275px] h-screen sticky top-0 flex flex-col px-2 lg:flex hidden">
          <div className="flex flex-col flex-1 gap-2">
            {/* Logo */}
            <Link href="/" className="p-4 hover:opacity-80 transition-opacity">
              <div className="relative w-8 h-8">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-brand via-purple-400 to-brand animate-gradient" />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">
                  T
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {children}

        {/* Right Sidebar */}
        <div className="w-[350px] sticky top-0 h-screen overflow-y-auto px-4 py-3 hidden lg:block right-sidebar">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-xl font-bold mb-2">New to Tusk?</h2>
            <p className="text-gray-400 mb-4">
              Sign up now to get your own personalized timeline!
            </p>
            <Link
              href="/auth/login"
              className="w-full bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full font-bold text-base transition flex items-center justify-center gap-2 group"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
