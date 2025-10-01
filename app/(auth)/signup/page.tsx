import SignUp from "@/components/Auth/SignUp";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <SignUp />;
}
