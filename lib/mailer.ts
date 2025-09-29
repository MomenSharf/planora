// lib/mailer.ts
import nodemailer from "nodemailer";

type SendOpts = {
  name?: string; // recipient name (optional)
  code: string; // verification code
  email: string;
  purpose?: string; // e.g., "Verify your email"
  expiresInMinutes?: number; // how long code is valid
  baseUrl?: string; // e.g., process.env.NEXT_PUBLIC_APP_URL
  includeCodeOnly?: boolean; // if true, send only code (no link button)
};



/**
 * Build a friendly HTML + plaintext email for verification code.
 */
function buildEmailTemplates({
  name,
  email,
  code,
  purpose = "Verify your email",
  expiresInMinutes = 15,
  baseUrl,
  includeCodeOnly = false,
}: {
  name?: string;
  email: string;
  code: string;
  purpose?: string;
  expiresInMinutes?: number;
  baseUrl?: string;
  includeCodeOnly?: boolean;
}) {
  const title = purpose;
  const greeting = name ? `Hello ${name},` : "Hello,";
  const verificationUrl =
    baseUrl && !includeCodeOnly
      ? `${baseUrl.replace(/\/$/, "")}/auth/verify?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`
      : null;

  const plaintext = `${greeting}

Your ${purpose.toLowerCase()} code is: ${code}

This code will expire in ${expiresInMinutes} minutes.

${
  verificationUrl
    ? `Or click the link to verify: ${verificationUrl}`
    : "If you didn't request this, you can ignore this email."
}

Thanks,
The Team
`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial; background:#f6f8fb; margin:0; padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 18px rgba(11,15,30,0.08); overflow:hidden;">
      <tr>
        <td style="padding:28px;">
          <h2 style="margin:0 0 8px 0; font-size:20px; color:#0f172a;">${title}</h2>
          <p style="margin:0 0 18px 0; color:#334155;">${greeting} <br/>Use the code below to ${purpose.toLowerCase()}.</p>

          <div style="display:flex; align-items:center; justify-content:center; margin:18px 0;">
            <div style="background:#f1f5f9; border-radius:10px; padding:18px 22px; font-size:28px; font-weight:700; letter-spacing:6px;">
              ${code}
            </div>
          </div>

          <p style="margin:12px 0 18px 0; color:#475569;">This code expires in <strong>${expiresInMinutes} minutes</strong>.</p>

          ${
            verificationUrl
              ? `<div style="text-align:center; margin:20px 0;">
                  <a href="${verificationUrl}" style="display:inline-block; padding:12px 20px; border-radius:10px; text-decoration:none; font-weight:600; background:#0f172a; color:#ffffff;">Verify now</a>
                </div>`
              : ""
          }

          <hr style="border:none; border-top:1px solid #eef2f7; margin:20px 0;">
          <p style="color:#94a3b8; font-size:13px; margin:0;">If you didn't request this, you can safely ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc; padding:12px 28px; text-align:center; color:#94a3b8; font-size:12px;">
          &copy; ${new Date().getFullYear()} Your Company — Need help? Reply to this email.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { plaintext, html };
}

/**
 * Create nodemailer transporter using env variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASS
 * - FROM_EMAIL (optional)
 */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Missing SMTP configuration in env. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS"
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Send verification email
 */
export async function sendVerificationEmail({
  name,
  code,
  email,
  purpose = "Verify your email",
  expiresInMinutes = 15,
  baseUrl,
  includeCodeOnly = false,
}: SendOpts) {
  const transporter = createTransporter();
  const fromEmail = process.env.FROM_EMAIL || `no-reply@${process.env.SMTP_HOST}`;

  const { plaintext, html } = buildEmailTemplates({
    name,
    email,
    code,
    purpose,
    expiresInMinutes,
    baseUrl,
    includeCodeOnly,
  });

  const mail = {
    from: `"Your App" <${fromEmail}>`,
    to: email,
    subject: purpose,
    text: plaintext,
    html,
  };

  const result = await transporter.sendMail(mail);

  // nodemailer sendMail returns info. You can return whatever you need.
  return {
    ok: true,
    messageId: result.messageId,
    info: result,
  };
}


