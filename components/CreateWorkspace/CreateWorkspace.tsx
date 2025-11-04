"use client";

import { createWorkspace } from "@/lib/actions/workspaces/create-workspace";
import {
  crateWorkspaceSchema,
  CrateWorkspaceSchema,
} from "@/lib/validation/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "../ui/form";
import InvitePeople from "./InvitePeople";
import WorkspaceInfoForm from "./WorkspaceInfoForm";

export default function CreateWorkspace({ user }: { user?: Session["user"] }) {
  const [step, setStep] = useState<"info" | "invite">("info");
  const router = useRouter();

  const form = useForm<CrateWorkspaceSchema>({
    resolver: zodResolver(crateWorkspaceSchema),
    defaultValues: {
      name: user?.name ? `${user?.name}'s Workspace` : "",
      description: "",
      type: undefined,
      invitationEmails: [],
    },
  });

  const onSubmit = async (data: CrateWorkspaceSchema) => {
    console.log(data);

    try {
      const res = await createWorkspace(data);

      if (res.success) {
        router.push("/workspaces");
        toast.success(`${res.data?.name} Created successfully`);
      } else {
        toast.error(res?.error || res?.error || "Invalid credentials");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Something went wrong! try again later");
    }
  };

  return (
    <div className="relative max-w-md overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <AnimatePresence mode="wait">
            {step === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <WorkspaceInfoForm
                  form={form}
                  onNext={() => setStep("invite")}
                />
              </motion.div>
            )}

            {step === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <InvitePeople form={form} onBack={() => setStep("info")} />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
}
