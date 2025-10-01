"use server";

import { db } from "@/lib/prisma";
import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { handleError } from "../errorHandler";
import { SignUpInput, signUpSchema } from "../validation/auth";
import { createAndSendVerificationCode } from "./verification-email";

export const SignUpAction = async (data: SignUpInput) => {
  try {
    const validatedData = signUpSchema.parse(data);

    if (!validatedData) {
      return { success: false, message: "Invalid input data" };
    }

    const { email, name, password } = validatedData;

    const userExists = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return {
        success: false,
        message: "Email already is in use. Please try another one.",
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

    return { success: true, message: "Code sent to email." };
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

