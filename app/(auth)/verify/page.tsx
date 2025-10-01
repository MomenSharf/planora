import VerifyCode from "@/components/Auth/VerifyCode";
import { getResendCooldown } from "@/lib/actions/auth/verification-email";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }

  if (!searchParams?.email || Array.isArray(searchParams.email)) {
    return redirect("/login");
  }

  const { secondsLeft } = await getResendCooldown(searchParams.email);

  return (
    <div className="flex items-center justify-center h-full">
      <VerifyCode email={searchParams.email} initialCooldown={secondsLeft} />
    </div>
  );
}
