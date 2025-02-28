"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import SplitLayout from "@/components/layout/SplitLayout";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";

export default function OnboardingForm() {
  const router = useRouter();
  const { refetchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({
    displayName: "",
    username: "",
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Get the wallet address from the API
  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (response.status === 404) {
          const data = await response.json();
          setWalletAddress(data.walletAddress);
        } else {
          // User already exists, redirect to home
          router.push("/home");
        }
      } catch (err) {
        console.error("Error getting wallet address:", err);
        toast.error("Failed to get wallet address. Please try again.");
      }
    };

    getWalletAddress();
  }, [router]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      displayName: "",
      username: "",
    };

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
      valid = false;
    } else if (displayName.length > 20) {
      newErrors.displayName = "Display name must be at most 20 characters";
      valid = false;
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (username.length < 6) {
      newErrors.username = "Username must be at least 6 characters long";
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!walletAddress) {
      toast.error("Wallet address not found. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          username,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // User created successfully, update the user context
      await refetchUser();

      // Show success toast
      toast.success("Profile created successfully!");

      // Navigate to home
      router.push("/home");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SplitLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand via-purple-400 to-brand bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_15px_rgba(190,63,213,0.3)]">
          Create your profile
        </h1>
        <p className="text-gray-400">Choose how you&apos;ll appear on Tusk</p>
        {walletAddress && (
          <p className="text-sm text-gray-500">
            Wallet: {walletAddress.substring(0, 6)}...
            {walletAddress.substring(walletAddress.length - 4)}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {errors.displayName && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.displayName}</p>
            </div>
          </div>
        )}
        {errors.username && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.username}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-300"
              >
                Display name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={20}
                className={`w-full px-4 py-4 bg-black/50 backdrop-blur-sm border ${
                  errors.displayName ? "border-red-500" : "border-purple-800/50"
                } rounded-xl 
                focus:ring-0 focus:border-brand focus:bg-black/70
                hover:border-purple-600/70 hover:bg-black/70
                text-white placeholder-gray-500 transition-all duration-200 outline-none`}
                placeholder="Your name"
                required
              />
              <p className="text-xs text-gray-500 text-right">
                {displayName.length}/20
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 z-10">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-8 pr-4 py-4 bg-black/50 backdrop-blur-sm border ${
                    errors.username ? "border-red-500" : "border-purple-800/50"
                  } rounded-xl
                  focus:ring-0 focus:border-brand focus:bg-black/70
                  hover:border-purple-600/70 hover:bg-black/70
                  text-white placeholder-gray-500 transition-all duration-200 outline-none`}
                  placeholder="username"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !walletAddress}
            className="w-full bg-brand hover:bg-brand/90 text-white px-6 py-4 rounded-full font-medium transition 
            focus:ring-2 focus:ring-offset-2 focus:ring-brand focus:ring-offset-black
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting up...
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </SplitLayout>
  );
}
