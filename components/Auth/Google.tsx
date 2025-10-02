"use client";

import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Loader } from "lucide-react";

export default function Google() {
  const [isPendiug, startTransition] = useTransition();

  const loginWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);

      toast("There was an error logging in with Google");
    }
  };
  return (
    <Button
      className="gap-2 w-full"
      variant="outline"
      size="lg"
      onClick={() => {
        startTransition(loginWithGoogle);
      }}
      disabled={isPendiug}
    >
      {isPendiug ? (
        <Loader className="w-7 h-7 animate-spin text-muted-foreground" />
      ) : (
        <Icons.google />
      )}
      Google
    </Button>
  );
}
