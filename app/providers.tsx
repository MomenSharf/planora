"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </SessionProvider>
  );
};

export default Providers;
