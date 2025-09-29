"use server";

import { db } from "@/lib/prisma";
import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { handleError } from "../errorHandler";
import { sendVerificationEmail } from "../mailer";
import { SignUpInput, signUpSchema } from "../validation/auth";

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

    const code = String(randomInt(100000, 999999));

    const verificationCode = await db.verificationCode.create({
      data: {
        email: lowerCaseEmail,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      },
    });

    if (!verificationCode) {
      return {
        success: false,
        message: "Failed to generate verification code.",
      };
    }

    const res = await sendVerificationEmail({
      email: lowerCaseEmail,
      name,
      code: code,
      purpose: "Verify your email",
      expiresInMinutes: 10,
    });

    if(!res.ok) {
      return { success: false, message: "Failed to send verification email." };
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

export async function resendVerificationCode(data: SignUpInput) {
  try {
    const { email, name, password } = signUpSchema.parse(data);
    // delete old codes
    await db.verificationCode.deleteMany({ where: { email } });

    // generate new 6-digit code
    const code = String(randomInt(100000, 999999));

    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 mins

    await db.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // TODO: send code via email service here (nodemailer, resend, etc.)
    // await sendEmail(email, code);

    return {
      success: true,
      message: "Verification code resent successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
