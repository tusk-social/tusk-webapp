import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from "@/lib/jwt";
import OnboardingForm from "@/components/auth/OnboardingForm";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken?.value) {
    redirect("/");
  }

  const decodedToken = decodeJwt(accessToken.value);
  const walletAddress = decodedToken?.properties?.id;

  if (!walletAddress) {
    redirect("/");
  }

  return <OnboardingForm />;
}
