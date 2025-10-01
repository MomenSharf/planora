"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  resendVerificationEmail,
  verifyCode,
} from "@/lib/actions/verification-email";
import { VerifyCodeInput, VerifyCodeSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import Countdown from "react-countdown";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function VerifyCode({
  email,
  initialCooldown = 0,
}: {
  email?: string;
  initialCooldown?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(initialCooldown); // countdown state

  const router = useRouter();

  const form = useForm<VerifyCodeInput>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = useCallback(async (data: VerifyCodeInput) => {
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      const res = await verifyCode(email!, data.code);

      if (res?.success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(res.message || "Invalid code");
      }
    } catch {
      toast.error("Something went wrong! try again later");
    }
  }, [email, router]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.code?.length === 6) {
        form.handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    startTransition(async () => {
      const res = await resendVerificationEmail(email!);

      if (res?.success) {
        toast.success("Verification email resent!");
        setCooldown(60); // enforce 1min
      } else {
        toast.error(res.message || "Failed to resend email");
        if ("secondsLeft" in res && typeof res.secondsLeft === "number") {
          setCooldown(res.secondsLeft); // set remaining cooldown if provided
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <Button size="icon" variant="outline" className="size-12 self-center">
        <MailCheck className="size-6"/>
      </Button>
      <h1 className="text-2xl font-bold">Enter verification code</h1>
      <h2 className="text-xl">{email}</h2>
      <p className="text-sm text-muted-foreground">
        Please enter the verification code sent to your email.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-2">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            Verify
          </Button>

          <Link className={buttonVariants({ variant: "link" })} href="/login">
            <ArrowLeft /> back to login
          </Link>

          <div className="flex justify-center">
            {form.formState.isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <p className="text-xs text-muted-foreground flex items-center">
                Didn&apos;t receive a code?
                {cooldown > 0 ? (
                  <Countdown
                    date={Date.now() + cooldown * 1000}
                    renderer={({ seconds }) => (
                      <span className="ml-2 text-primary">
                        Resend in {seconds}s
                      </span>
                    )}
                    onComplete={() => setCooldown(0)}
                  />
                ) : (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 ml-1 cursor-pointer"
                    disabled={isPending || form.formState.isSubmitting}
                    onClick={handleResend}
                  >
                    Resend
                  </Button>
                )}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
