import Image from "next/image";
import mammothLogo from "@/assets/mammoth.png";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black -z-0">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand blur-[128px] animate-glow" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-900 blur-[128px] animate-glow-slow" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <Image
          src={mammothLogo}
          alt="Tusk Logo"
          width={350}
          height={350}
          className="w-auto h-auto"
          priority
        />
      </div>

      <div className="flex-1 flex flex-col justify-center p-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-brand via-purple-400 to-brand bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_15px_rgba(190,63,213,0.3)]">
              Tusk is alive.
            </h1>
            <h2 className="text-3xl font-bold text-white">
              Join today.
            </h2>
          </div>

          <div className="space-y-4">

            <button className="w-full bg-brand hover:bg-brand-600 text-white px-6 py-4 rounded-full font-medium transition">
              Create account
            </button>
            <p className="text-xs text-gray-500">
              This project is a work in progress for Mammothon 2025. 
              Lots of features are missing for now and lots of things will change during the development.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-purple-800/50" />
              <span className="text-purple-400">or</span>
              <div className="flex-1 h-px bg-purple-800/50" />
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full border border-purple-800 text-brand hover:bg-brand/10 px-6 py-4 rounded-full font-medium transition">
              Restore Access
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
