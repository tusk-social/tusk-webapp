import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

// This is a Server Component
export default function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");

  if (accessToken?.value) {
    redirect("/home");
  }

  return <LandingPage />;
}
