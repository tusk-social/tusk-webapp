import SplitLayout from "@/components/layouts/SplitLayout";

export default function OnboardingPage() {
  return (
    <SplitLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand via-purple-400 to-brand bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_15px_rgba(190,63,213,0.3)]">
          Create your profile
        </h1>
        <p className="text-gray-400">
          Choose how you&apos;ll appear on Tusk
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
              Display name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-purple-800/50 rounded-xl 
              focus:ring-0 focus:border-brand focus:bg-black/70
              hover:border-purple-600/70 hover:bg-black/70
              text-white placeholder-gray-500 transition-all duration-200 outline-none"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                @
              </span>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full pl-8 pr-4 py-4 bg-black/50 backdrop-blur-sm border border-purple-800/50 rounded-xl
                focus:ring-0 focus:border-brand focus:bg-black/70
                hover:border-purple-600/70 hover:bg-black/70
                text-white placeholder-gray-500 transition-all duration-200 outline-none"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand hover:bg-brand/90 text-white px-6 py-4 rounded-full font-medium transition focus:ring-2 focus:ring-offset-2 focus:ring-brand focus:ring-offset-black"
        >
          Continue
        </button>
      </div>
    </SplitLayout>
  );
} 