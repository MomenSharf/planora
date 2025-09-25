import Logo from "@/components/Layout/Logo";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen">
      <div className="flex flex-col p-3">
        <Logo />
        <div className="flex-1">{children}</div>
      </div>
      <div
        style={{
          backgroundImage: "url('/images/auth-image.jpg')",
          backgroundSize: "cover",
          backgroundPositionY: "center",
        }}
        className="hidden sm:block"
      />
    </div>
  );
}
