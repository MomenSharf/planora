import { cn } from "@/lib/utils";
import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

interface LoaderProps {
  isLoading?: boolean;
  size?: number;
  className?: string;
}

export default function Loader({
  isLoading = false,
  size = 18,
  className,
}: LoaderProps) {
  if (!isLoading) return null;

  return (
    <LoaderIcon
      className={cn("animate-spin", className, {
        "text-transparent": !isLoading,
      })}
      size={size}
      strokeWidth={2.5}
    />
  );
}
