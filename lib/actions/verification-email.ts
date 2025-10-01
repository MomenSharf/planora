"use server";

import { sendVerificationEmail } from "../mailer";
import { db } from "../prisma";


// Save verification code to DB (delete old first)
export const createAndSendVerificationCode = async (email: string) => {
  try {
    // Delete old codes for this email

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const verificationCode = await db.verificationCode.create({
      data: { email, code, expiresAt },
    });

    if (!verificationCode) {
      return { success: false, message: "Failed to create verification code" };
    }

    const sendRes = await sendVerificationEmail(email, code);
    if (!sendRes.success) {
      return { success: false, message: "Failed to send verification email" };
    }

    return {
      success: true,
      message: "Verification code created and email sent",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to create verification code" };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    // Delete old codes for this email
    await db.verificationCode.deleteMany({ where: { email } });

    const res = await createAndSendVerificationCode(email);
    return res;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to resend verification email" };
  }
};

export const verifyCode = async (email: string, code: string) => {
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

    await db.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await db.verificationCode.deleteMany({ where: { email } });
    
    return { success: true, message: "Code verified." };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { success: false, message: "Failed to verify code." };
  }
}
