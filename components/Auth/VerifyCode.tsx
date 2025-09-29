"use client";

import { Button } from "@/components/ui/button";
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
import { resendVerificationCode } from "@/lib/actions/singup.actions";
import { VerifyCodeInput, VerifyCodeSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
export default function VerifyCode({ email }: { email?: string }) {
  const form = useForm<VerifyCodeInput>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (data: VerifyCodeInput) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <h1 className="text-2xl font-bold">Enter verification code</h1>
      <h2 className="text-xl">{email}</h2>
      <p className="text-sm text-muted-foreground">
        Please enter the verification code sent to your email.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive a code?
            <Button
              variant="link"
              size="sm"
              className="text-xs p-0 ml-1 cursor-pointer"
              // onClick={() => resendVerificationCode(form.getValues())}
            >
              Resend
            </Button>
          </p>
        </form>
      </Form>
    </div>
  );
}
