import CreateWorkspace from "@/components/CreateWorkspace/CreateWorkspace";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-5 w-full  sm:p-6">
      <div>

      <p className="text-3xl font-extrabold">Create Your Workspace</p>
      <p className="text-muted-foreground text-sm">
        Organize your team, projects, and goals — all in one shared space.
      </p>
      </div>
      <CreateWorkspace />
    </div>
  );
}
