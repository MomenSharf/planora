import Logo from "@/components/Layout/Logo";
import JoinWorkspace from "@/components/onboarding/JoinWorkspace";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-full">
      <Logo withText={false} size={75} />
      <h1 className="font-semibold text-2xl">Welcome to Planora</h1>
      <p className="text-muted-foreground text-sm break-words whitespace-normal max-w-96 text-center">
        A workspace is where your team collaborates, manages projects, and
        tracks progress.
      </p>
      <JoinWorkspace />
      <div className="relative w-full">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          Or
        </span>
      </div>
      <div>
        <Separator />
      </div>
      <Link href="/create-workspace" className={cn(buttonVariants({ size: "lg" }), 'w-full')}>
        Crate new Workspace
      </Link>
    </div>
  );
}
