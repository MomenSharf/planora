"use server";

import { db } from "@/lib/prisma";
import { SignUpInput, signUpSchema } from "@/lib/validation/auth";
import { hash } from "bcrypt";
import { createAndSendVerificationCode } from "./verification-email";
import { handleError } from "@/lib/errorHandler";

export const SignUpAction = async (data: SignUpInput) => {
  try {
    const validatedData = signUpSchema.parse(data);

    if (!validatedData) {
      return { success: false, message: "Invalid input data" };
    }

    const { email, name, password } = validatedData;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Case: already registered with Google (no password saved)
      if (!existingUser.password) {
        return {
          success: false,
          message: "This email is already registered with Google. Please sign in with Google.",
        };
      }

      // Case: already registered with credentials
      return {
        success: false,
        message: "This email is already registered. Please sign in instead.",
      };
    }

    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
      },
    });

    if (!user) {
      return { success: false, message: "Failed to create user." };
    }

    const sendRes = await createAndSendVerificationCode(email);
    if (!sendRes.success) {
      return { success: false, message: sendRes.message };
    }

    return { success: true, message: "Verification code sent to email." };
  } catch (error) {
    return handleError(error);
  }
};

export async function verifySignupCode({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const record = await db.verificationCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record)
      return { success: false, message: "No code found for this email." };

    if (record.expiresAt < new Date()) {
      await db.verificationCode.delete({ where: { id: record.id } });
      return {
        success: false,
        message: "Code expired, request a new one.",
      };
    }

    if (record.code !== code) {
      return { success: false, message: "Invalid code." };
    }

    const user = await db.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await db.verificationCode.deleteMany({ where: { email } });

    return { success: true, user };
  } catch (error) {
    return handleError(error);
  }
}

