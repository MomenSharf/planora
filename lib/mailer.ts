import nodemailer from "nodemailer";
import { db } from "@/lib/prisma";
import { success } from "zod";

// ✅ Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});



// Send verification email
export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Use the code below to verify your email:</p>
          <h1 style="color: #4CAF50;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }
};
