import { payment_status } from "../../../generated/prisma/client";

export interface RejectPaymentResponseDto {
  message: string;

  data: {
    id: number;
    reservationId: number;
    status: payment_status;
  };
}