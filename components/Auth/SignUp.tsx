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
import { SignUpAction } from "@/lib/actions/auth/singup.actions";
import { SignUpInput, signUpSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AuthWrapper from "./AuthWrapper";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      const { success, message } = await SignUpAction(data);
      if (success) {
        toast(message);

        router.push(`/verify?email=${data.email}`);
      } else {
        toast.error(message || "Something went wrong! try again later");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Something went wrong! try again later");
    }
  };
  return (
    <AuthWrapper
      title="Create an Account  🚀"
      subTitle="Sign in to continue to your account"
      variant="signup"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="bg-" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
              <FormItem >
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
          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Sign Up
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
