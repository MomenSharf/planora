import React from "react";
import { Icons } from "../icons";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <Icons.logo className="w-10 h-10 fill-primary" />
      <h1 className="text-lg font-medium">Planoraa</h1>
    </div>
  );
}
