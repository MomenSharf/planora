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
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/auth/forgot-password";
import { ResetPasswordInput, resetPasswordSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPassword({
  token,
  isValid,
  message,
}: {
  token: string;
  isValid: boolean;
  message: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log(isValid);

  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ResetPasswordInput) => {
      try {
        const res = await resetPassword({ token, ...data });

        if (res?.success) {
          toast.success("Password reset successful!");
          router.push("/login");
        } else {
          toast.error(res.message || "Invalid code");
        }
      } catch {
        toast.error("Something went wrong! try again later");
      }
    },
    [token, router]
  );

  useEffect(() => {
    if (!isValid) {
      setTimeout(() => toast.error(message), 0);
    }
  }, []);
  return (
    <div className="flex flex-col gap-5 text-center">
      <Button size="icon" variant="outline" className="size-12 self-center">
        <Lock className="size-6" />
      </Button>
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p className="text-sm text-muted-foreground">
        Please enter your new password to reset your account.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="minimum 8 characters"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0  rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md bg-background focus:ring-0 -z-[-2]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="minimum 8 characters"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0  rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md bg-background focus:ring-0 -z-[-2]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full cursor-pointer"
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
