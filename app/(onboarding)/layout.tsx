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
          {children}
        </div>
      </div>
      <div className="col-span-3 hidden sm:block">
        <div
          style={{
            backgroundImage: "url('/images/onboarding-image.jpg')",
          }}
          className="w-full h-full  bg-cover bg-left sm:bg-center"
        />
      </div>
    </div>
  );
}
