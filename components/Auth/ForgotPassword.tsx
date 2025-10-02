"use client";
import { cn } from "@/lib/utils";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { sendResetPasswordEmail } from "@/lib/mailer";
import { createAndSendPasswordResetToken } from "@/lib/actions/auth/forgot-password";

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const res = await createAndSendPasswordResetToken(data.email);
      // const res = await verifyCode(email!, data.code);

      if (res?.success) {
        toast.success("Reset password link send successfuly");
        router.push("/login");
      } else {
        toast.error(res.message || "Invalid token");
      }
    } catch {
      toast.error("Something went wrong! try again later");
    }
  };

  return (
    <div className="flex flex-col gap-5 text-center">
      <Button size="icon" variant="outline" className="size-12 self-center">
        <Fingerprint className="size-6" />
      </Button>
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p className="text-sm text-muted-foreground">
        Please enter your email address to reset your password.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Send Reset Link
          </Button>
          <Link
            className={cn(buttonVariants({ variant: "link" }), "w-full")}
            href="/login"
          >
            <ArrowLeft /> back to login
          </Link>
        </form>
      </Form>
    </div>
  );
}
