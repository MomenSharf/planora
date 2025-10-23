import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-8 min-h-screen bg-[#fcfeff]">
      <div className="flex flex-col col-span-5 p-3">
        <div className="flex-1 flex justify-center items-center">
          <div>{children}</div>
        </div>
      </div>
      <div className="p-2 col-span-3">
        <div
          style={{
            backgroundImage: "url('/images/onboarding-image.jpg')",
            backgroundSize: "cover",
            backgroundPositionY: "center",
          }}
          className="w-full h-full hidden sm:block rounded-xl"
        />
      </div>
    </div>
  );
}
