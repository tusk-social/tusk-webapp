import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from "@/lib/jwt";

// This is a Server Component
export default async function TempPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  // Check if access_token exists
  if (!accessToken?.value) {
    // No token, redirect to login
    redirect("/_chopin/login");
  }

  // Decode the token
  const decodedToken = decodeJwt(accessToken.value);

  // Extract user ID (wallet address)
  const userId = decodedToken?.properties?.id || "Unknown ID";

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Temporary User Information Page
      </h1>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">
          Decoded Token Information
        </h2>

        <div className="mb-4">
          <p className="text-gray-400 mb-1">User ID (Wallet Address):</p>
          <p className="font-mono bg-gray-800 p-2 rounded">{userId}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 mb-1">Full Token Payload:</p>
          <pre className="font-mono bg-gray-800 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <p className="text-gray-400">Raw Token:</p>
          <div className="font-mono bg-gray-800 p-4 rounded overflow-auto max-h-40 text-xs">
            {accessToken.value}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-400">
          This is a temporary page to display the decoded token information. In
          the future, this will be part of the onboarding flow.
        </p>
      </div>
    </div>
  );
}
