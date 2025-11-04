import CreateWorkspace from "@/components/CreateWorkspace/CreateWorkspace";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

export default async function page() {
  const session = await getCurrentUser();
  return (
    <div className="flex flex-col gap-5  sm:p-6">
      <CreateWorkspace user={session?.user} />
    </div>
  );
}
