import { reservation_status } from "../../../generated/prisma/client";

export interface CreateReservationResponseDto {
  message: string;

  data: {
    id: number;
    bookingCode: string;

    roomId: number;

    checkInDate: Date;
    checkOutDate: Date;

    guestCount: number;

    roomPrice: string;
    peakSeasonAdjustment: string;
    totalPrice: string;

    status: reservation_status;

    bookingExpiredAt: Date;
  };
}