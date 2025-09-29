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
import { LoginInput, loginSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthWrapper from "./AuthWrapper";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await signIn("credentials", {
        // redirect: false,
        email: data.email,
        password: data.password,

      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Something went wrong! try again later");
    }
  }
  return (
    <AuthWrapper
      title="Welcome Back 👋"
      subTitle="Log in to access your account"
      variant="login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2">
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
        <Link
          href="/forgot-password"
          className="text-xs text-primary underline mb-4 block text-end"
        >
          Forgot Password?
        </Link>
        <Button
          className="w-full cursor-pointer"
          size="lg"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Login
        </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
