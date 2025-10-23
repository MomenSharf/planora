import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";
import Google from "./Google";

export default function AuthWrapper({
  title,
  subTitle,
  variant,
  children,
}: {
  title: string;
  subTitle: string;
  variant: "login" | "signup";
  children: React.ReactNode;
}) {


  return (
    <div className="h-full flex flex-col gap-3 max-w-xl">
      <div className="flex-1 flex flex-col justify-center items-center gap-3 ">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-3">
            <p className="text-3xl font-extrabold">{title}</p>
            <p className="text-muted-foreground text-sm">{subTitle}</p>
          </div>
          <div className="flex-1">{children}</div>
          <div className="relative mt-2">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              Or Continue With
            </span>
          </div>
         <Google />
        </div>
      </div>
      <div className="text-sm text-muted-foreground text-center">
        {variant === "login" ? (
          <p>
            {" "}
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
