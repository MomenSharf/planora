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

  const verifyedtoken = await verifyToken(token);

  console.log(verifyToken);
  

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ResetPassword
        token={token}
        isValid={verifyedtoken?.success}
        message={verifyedtoken.message}
      />
      <div className="h-10 w-full" />
    </div>
  );
}
