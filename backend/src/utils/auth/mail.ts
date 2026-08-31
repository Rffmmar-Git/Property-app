import { mailTransporter } from "../../config/mail";
import { env } from "../../config/env";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({
  to,
  subject,
  html,
}: SendMailOptions) {
  await mailTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verifyUrl =
    `http://localhost:5173/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Verify Your Email</h2>
      <p>Click the button below to verify your account and set your password.</p>
      <a href="${verifyUrl}"
         style="
           display:inline-block;
           padding:12px 20px;
           background:#2563eb;
           color:white;
           text-decoration:none;
           border-radius:8px;
         ">
         Verify Email
      </a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}

export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const resetUrl =
    `http://localhost:5173/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset Password</h2>
      <p>Click the button below to reset your password.</p>
      <a href="${resetUrl}"
         style="
           display:inline-block;
           padding:12px 20px;
           background:#dc2626;
           color:white;
           text-decoration:none;
           border-radius:8px;
         ">
         Reset Password
      </a>
      <p>This link will expire in 15 minutes and can only be used once.</p>
    `,
  });
}