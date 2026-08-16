import { reservation_status } from "../../../generated/prisma/client";

export interface CancelReservationResponseDto {
  message: string;

  data: {
    id: number;

    bookingCode: string;

    status: reservation_status;

    cancelledAt: Date | null;
  };
}