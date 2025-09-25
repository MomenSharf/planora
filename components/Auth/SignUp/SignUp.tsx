"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpInput, signUpSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthWrapper from "../AuthWrapper";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  return (
    <AuthWrapper
      title="Create an Account  🚀"
      subTitle="Sign in to continue to your account"
      variant="signup"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
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
            <FormItem className="mb-4">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Minimum 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" size="lg">
          Sign Up
        </Button>
      </Form>
    </AuthWrapper>
  );
}
