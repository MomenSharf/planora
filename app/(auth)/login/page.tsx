import Login from "@/components/Auth/Login";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getCurrentUser();

  console.log(session);
  

  if (session) {
    return redirect("/");
  }
  return <Login />;
}
