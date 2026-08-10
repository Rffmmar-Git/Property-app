import { mailTransporter } from "../config/mail";
import { env } from "../config/env";

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