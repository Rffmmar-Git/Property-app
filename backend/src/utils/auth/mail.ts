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

      <p>
        Click the button below to verify your account
        and set your password.
      </p>

      <a
        href="${verifyUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Verify Email
      </a>

      <p>
        This link will expire in 15 minutes.
      </p>
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

      <p>
        Click the button below to reset your password.
      </p>

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#dc2626;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>

      <p>
        This link will expire in 15 minutes
        and can only be used once.
      </p>
    `,
  });
}

export async function sendPaymentApprovedEmail(
  email: string,
  customerName: string,
  bookingCode: string,
  propertyName: string,
  propertyDescription: string | null,
  propertyAddress: string,
  roomName: string,
  checkIn: Date,
  checkOut: Date,
  checkInTime: Date | null,
  checkOutTime: Date | null,
  guestCount: number,
  totalPrice: string
) {
  await sendMail({
    to: email,
    subject: "Booking Confirmed - Payment Successful",
    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px 24px;
          background-color: #ffffff;
          color: #1f2937;
        "
      >
        <h2 style="margin-bottom: 8px;">
          Booking Confirmed
        </h2>

        <p>
          Hello ${customerName},
        </p>

        <p>
          Great news! Your payment has been successfully
          verified by the property.
        </p>

        <div
          style="
            margin: 24px 0;
            padding: 20px;
            background-color: #f3f4f6;
            border-radius: 12px;
          "
        >
          <h3 style="margin-top: 0;">
            Booking Details
          </h3>

          <p>
            <strong>Booking Code:</strong>
            ${bookingCode}
          </p>

          <p>
            <strong>Property:</strong>
            ${propertyName}
          </p>

          <p>
            <strong>Room:</strong>
            ${roomName}
          </p>

          <p>
            <strong>Address:</strong>
            ${propertyAddress}
          </p>

          <p>
            <strong>Check-in:</strong>
            ${checkIn.toISOString().split("T")[0]}
          </p>

          <p>
            <strong>Check-out:</strong>
            ${checkOut.toISOString().split("T")[0]}
          </p>

          <p>
            <strong>Guests:</strong>
            ${guestCount}
          </p>

          <p>
            <strong>Total Payment:</strong>
            ${totalPrice}
          </p>
        </div>

        ${
          propertyDescription
            ? `
              <div
                style="
                  margin: 24px 0;
                  padding: 20px;
                  background-color: #eff6ff;
                  border-radius: 12px;
                "
              >
                <h3 style="margin-top: 0;">
                  Property Information
                </h3>

                <p>
                  ${propertyDescription}
                </p>
              </div>
            `
            : ""
        }

        <div
          style="
            margin: 24px 0;
            padding: 20px;
            background-color: #fefce8;
            border-radius: 12px;
          "
        >
          <h3 style="margin-top: 0;">
            Check-in Information
          </h3>

          <p>
            <strong>Check-in Time:</strong>
            ${
              checkInTime
                ? checkInTime.toISOString().split("T")[1].slice(0, 5)
                : "14:00"
            }
          </p>

          <p>
            <strong>Check-out Time:</strong>
            ${
              checkOutTime
                ? checkOutTime.toISOString().split("T")[1].slice(0, 5)
                : "12:00"
            }
          </p>
        </div>

        <p>
          Please keep your booking code for your records.
        </p>

        <p>
          Thank you for choosing our property.
          We look forward to welcoming you!
        </p>

        <hr
          style="
            margin: 32px 0;
            border: none;
            border-top: 1px solid #e5e7eb;
          "
        />

        <p
          style="
            font-size: 12px;
            color: #6b7280;
          "
        >
          This is an automated email. Please do not reply
          directly to this email.
        </p>
      </div>
    `,
  });
}

export async function sendPaymentRejectedEmail(
  email: string,
  customerName: string,
  bookingCode: string,
  propertyName: string,
  roomName: string
) {
  await sendMail({
    to: email,
    subject: "Payment Rejected - Action Required",
    html: `
      <h2>Payment Rejected</h2>

      <p>
        Hello ${customerName},
      </p>

      <p>
        Unfortunately, your payment proof for the reservation below
        has been rejected by the property.
      </p>

      <h3>Booking Details</h3>

      <p>
        <strong>Booking Code:</strong>
        ${bookingCode}
      </p>

      <p>
        <strong>Property:</strong>
        ${propertyName}
      </p>

      <p>
        <strong>Room:</strong>
        ${roomName}
      </p>

      <p>
        Your reservation has been returned to
        <strong>Waiting for Payment</strong>.
      </p>

      <p>
        Please upload a valid payment proof again
        to continue your reservation.
      </p>

      <p>
        If you believe this rejection was made by mistake,
        please contact the property.
      </p>
    `,
  });
}

export async function sendCheckInReminderEmail(
  email: string,
  customerName: string,
  bookingCode: string,
  propertyName: string,
  propertyAddress: string,
  roomName: string,
  checkIn: Date,
  checkOut: Date,
  checkInTime: Date | null,
  guestCount: number
) {
  await sendMail({
    to: email,
    subject: "Reminder - Your Check-in Is Tomorrow",
    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px 24px;
          background-color: #ffffff;
          color: #1f2937;
        "
      >
        <h2>
          Your Check-in Is Tomorrow
        </h2>

        <p>
          Hello ${customerName},
        </p>

        <p>
          This is a reminder that your stay is scheduled
          to begin tomorrow.
        </p>

        <div
          style="
            margin: 24px 0;
            padding: 20px;
            background-color: #f3f4f6;
            border-radius: 12px;
          "
        >
          <h3 style="margin-top: 0;">
            Booking Details
          </h3>

          <p>
            <strong>Booking Code:</strong>
            ${bookingCode}
          </p>

          <p>
            <strong>Property:</strong>
            ${propertyName}
          </p>

          <p>
            <strong>Room:</strong>
            ${roomName}
          </p>

          <p>
            <strong>Address:</strong>
            ${propertyAddress}
          </p>

          <p>
            <strong>Check-in:</strong>
            ${checkIn.toISOString().split("T")[0]}
          </p>

          <p>
            <strong>Check-out:</strong>
            ${checkOut.toISOString().split("T")[0]}
          </p>

          <p>
            <strong>Guests:</strong>
            ${guestCount}
          </p>

          <p>
            <strong>Check-in Time:</strong>
            ${
              checkInTime
                ? checkInTime.toISOString().split("T")[1].slice(0, 5)
                : "14:00"
            }
          </p>
        </div>

        <p>
          Please make sure you have your booking code ready
          when you arrive at the property.
        </p>

        <p>
          We look forward to welcoming you!
        </p>

        <hr
          style="
            margin: 32px 0;
            border: none;
            border-top: 1px solid #e5e7eb;
          "
        />

        <p
          style="
            font-size: 12px;
            color: #6b7280;
          "
        >
          This is an automated email. Please do not reply
          directly to this email.
        </p>
      </div>
    `,
  });
}