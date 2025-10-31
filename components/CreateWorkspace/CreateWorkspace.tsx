"use client";

import { CrateWorkspace, crateWorkspace } from "@/lib/validation/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import WorkspaceInfoForm from "./WorkspaceInfoForm";

export default function CreateWorkspace() {
  const [step, setStep] = useState<"info" | "invit">("info");
  const router = useRouter();

  const form = useForm<CrateWorkspace>({
    resolver: zodResolver(crateWorkspace),
    defaultValues: {
      name: "",
      description: "",
      type: "other",
      invitationEmails: [],
    },
  });

  return (
    <div>
      {step === "info" && (
        <div>
          
        <WorkspaceInfoForm
          form={form}
          onNext={() => setStep("invit")}
          />
          </div>
      )}
      {step === "invit" && <div>Invitation Step...</div>}
    </div>
  );
}
