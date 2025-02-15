import Image from "next/image";
import mammothLogo from "@/assets/mammoth.png";
import Link from "next/link";

interface SplitLayoutProps {
  children: React.ReactNode;
}

export default function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black -z-0">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand/40 blur-[160px] animate-glow" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/50 blur-[140px] animate-glow-slow" />
          <div className="absolute bottom-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand/30 blur-[150px] animate-glow-slower" />
        </div>
      </div>

      <div className="flex items-center justify-center p-4 md:p-8 md:flex-1 relative z-10">
        <Link href="/">
        <Image
          src={mammothLogo}
          alt="Tusk Logo"
          width={500}
          height={500}
          className="w-24 h-auto md:w-48 md:h-auto xl:w-96 xl:h-auto"
          priority
        />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center p-4 md:p-8 relative z-10">
        <div className="w-full md:max-w-md space-y-8">
          {children}
        </div>
      </div>
    </main>
  );
} 