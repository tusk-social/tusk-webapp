import { cookies } from "next/headers";
import LandingPage from "@/components/LandingPage";
import AuthRedirect from "@/components/auth/AuthRedirect";

// This is a Server Component
export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  // If no token, show landing page
  if (!accessToken?.value) {
    return <LandingPage />;
  }

  return <AuthRedirect />;
}
