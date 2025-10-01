import nodemailer from "nodemailer";

// ✅ Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Gmail
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});

// ✉️ Send verification email (with link)
export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">Welcome to QuizzesUp 🎉</h2>
          <p style="font-size: 16px; color: #555;">
            Thanks for signing up! Please confirm your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
              style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">
            This link will expire in <strong>10 minutes</strong>.<br>
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }
};

// ✉️ Send reset password email (with link)
export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request 🔑</h2>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password. Click the button below to set a new one:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
              style="background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">
            This link will expire in <strong>10 minutes</strong>.<br>
            If you didn’t request this, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send password reset email" };
  }
};
