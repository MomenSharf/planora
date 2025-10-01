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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export default function VerifyCode({ email }: { email?: string }) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<VerifyCodeInput>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: VerifyCodeInput) => {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Something went wrong! try again later");
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.code?.length === 6) {
        form.handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex flex-col gap-4 text-center">
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
          <Link className={buttonVariants({ variant: "ghost" })} href="/login">
            {" "}
            <ArrowLeft /> back to login
          </Link>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            Verify
          </Button>
          <div className="flex justify-center">
            {form.formState.isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive a code?
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs p-0 ml-1 cursor-pointer"
                  disabled={isPending || form.formState.isSubmitting}
                  onClick={() =>
                    startTransition(async () => {
                      if (!email) {
                        toast.error("Email is required");
                        return;
                      }
                      const res = await resendVerificationEmail(email!);
                      if (res?.success) {
                        toast.success("Verification email resent!");
                      } else {
                        toast.error(res.message || "Failed to resend email");
                      }
                    })
                  }
                >
                  Resend
                </Button>
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
