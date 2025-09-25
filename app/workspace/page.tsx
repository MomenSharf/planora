import React from "react";

export default function page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center px-4 z-50">
        Header
      </header>

      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 bottom-0 w-64 bg-gray-900 text-white p-4">
          Sidebar
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
          <p className="mt-4">More content...</p>
          <p className="mt-4">More content...</p>
          <p className="mt-4">More content...</p>
          <p className="mt-4">More content...</p>
        </main>
      </div>
    </div>
  );
}
