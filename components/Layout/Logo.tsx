import React from "react";
import Image from "next/image";

export default function Logo({
  withText= false,
  size = 50,
}: {
  withText?: boolean;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        <Image src="/images/logo.png" alt="logo" width={size} height={size} />
      </div>
      {withText && <h1 className="text-lg font-medium">Planora</h1>}
    </div>
  );
}
