"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { CrateWorkspaceSchema } from "@/lib/validation/workspaces";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Layout/Loader";

export default function InvitePeople({
  form,
  onBack,
}: {
  form: UseFormReturn<CrateWorkspaceSchema>;
  onBack: () => void;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const emails = form.watch("invitationEmails") || [];

  const addEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("invaild email address");
      return;
    }
    if (emails.includes(email)) {
      setEmailError("this email exist");
      return;
    }

    setEmailError(null);

    form.setValue("invitationEmails", [...emails, email]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    form.setValue(
      "invitationEmails",
      emails.filter((e) => e !== email)
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  useEffect(() => {
    if (emailError && /\S+@\S+\.\S+/.test(emailInput)) {
      setEmailError(null);
    }
  }, [emailInput]);

  return (
    <div className="flex flex-col gap-5 sm:p-6">
      <Button size="icon" variant="outline" className="size-12 self-center">
        <Send className="size-6" />
      </Button>
      <div>
        <h1 className="text-2xl font-extrabold">
          Invite people to your workspace
        </h1>
        <p className="text-muted-foreground text-sm">
          Add your teammates by email so they can join this workspace.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1 p-3 rounded-md border max-h-40 overflow-y-auto">
          <AnimatePresence>
            {emails.map((email) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 border rounded-md text-xs p-1 pl-2 bg-muted"
              >
                {email}
                <Button
                  onClick={() => removeEmail(email)}
                  className="size-4 rounded-sm group hover:bg-destructive hover:text-destructive-foreground"
                  variant="outline"
                  type="button"
                >
                  <X className="size-3 group-hover:text-primary-foreground" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an email and press Enter"
            className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-transparent shadow-none flex-1 min-w-52"
            autoFocus
          />
        </div>

        {emailError && <p className="text-xs text-destructive">{emailError}</p>}

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <Button size="lg" variant="outline" type="button" onClick={onBack}>
            <ChevronLeft />
            Back
          </Button>
          <Button size="lg" type="submit">
            <Loader isLoading={form.formState.isSubmitting} />
            {emails.length > 0 ? "Invite" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
