// lib/authHandlers.ts
"use client";

import { LoginInput } from "@/lib/validation/auth"; // adjust path if needed
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const handleLogin = async (
  data: LoginInput,
  router: AppRouterInstance
) => {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.ok) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    toast.error("Something went wrong! Try again later");
  }
};
