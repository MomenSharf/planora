import { z } from "zod";

/**
 * Sign In Schema
 */
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Sign Up Schema
 */
export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
