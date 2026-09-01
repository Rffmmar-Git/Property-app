import { payment_status } from "../../../generated/prisma/client";

export interface ConfirmPaymentResponseDto {
  message: string;

  data: {
    id: number;
    reservationId: number;
    status: payment_status;
    paidAt: Date | null;
  };
}