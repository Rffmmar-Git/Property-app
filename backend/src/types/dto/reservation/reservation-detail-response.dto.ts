import {
  payment_status,
  reservation_status,
} from "../../../generated/prisma/client";

export interface ReservationDetailResponseDto {
  message: string;

  data: {
    id: number;
    bookingCode: string;

    propertyName: string;
    roomName: string;

    checkInDate: Date;
    checkOutDate: Date;

    guestCount: number;

    totalPrice: string;

    reservationStatus: reservation_status;

    paymentProof?: string | null;

    bankDetails: {
    bankName: string | null;
    accountName: string | null;
    accountNumber: string | null;
  } | null;
  };
}