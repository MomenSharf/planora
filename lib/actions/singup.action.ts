"use server";

import { db } from "@/lib/prisma";
import { SignUpInput, signUpSchema } from "../validation/auth";
import { randomInt } from "crypto";

export const SignUpAction = async (data: SignUpInput) => {
  try {
    const validatedData = signUpSchema.parse(data);

    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    const { email, name, password } = validatedData;

    const userExists = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return {
        error: "Email already is in use. Please try another one.",
      };
    }

    const lowerCaseEmail = email.toLowerCase();

    const user = await db.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    if (!user) {
      return { error: "Failed to create user." };
    }

    const code = String(randomInt(100000, 999999));

    await db.verificationCode.create({
      data: {
        email: lowerCaseEmail,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    if (!code) {
      return { error: "Failed to generate verification code." };
    }

    return { success: true, message: "Code sent to email." };
  } catch (error) {
    console.error(error);
    if ((error as { code: string }).code === "ETIMEDOUT") {
      return {
        success: false,
        message: "Unable to connect to the database. Please try again later.",
      };
    } else if ((error as { code: string }).code === "503") {
      return {
        success: false,
        message: "Service temporarily unavailable. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }
};

export async function verifySignupCode({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const record = await db.verificationCode.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" }, // latest code
  });

  if (!record) return { error: "No code found" };

  if (record.expiresAt < new Date()) {
    await db.verificationCode.delete({ where: { id: record.id } });
    return { error: "Code expired, request a new one." };
  }

  if (record.attempts >= 5) {
    await db.verificationCode.delete({ where: { id: record.id } });
    return { error: "Too many attempts, please request a new code." };
  }

  if (record.code !== code) {
    await db.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return {
      error: `Invalid code. You have ${4 - record.attempts} attempts left.`,
    };
  }

  const user = await db.user.update({
    where: { email },
    data: {
      emailVerified: new Date(),
    },
  });

  await db.verificationCode.deleteMany({ where: { email } });

  return { success: true, user };
}
