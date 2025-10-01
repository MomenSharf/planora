import ResetPassword from "@/components/Auth/ResetPassword";
import { verifyToken } from "@/lib/actions/auth/forgot-password";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const token =
    typeof searchParams?.token === "string" ? searchParams?.token : undefined;

  if (!token) {
    return redirect("/login");
  }

  const res = await verifyToken(token);

  if (!res.success) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center h-full">
      <ResetPassword token={token} />
    </div>
  );
}
