import {
  payment_status,
  reservation_status,
} from "../../../generated/prisma/client";

export interface ReservationListItemDto {
  id: number;

  bookingCode: string;

  propertyName: string;

  roomName: string;

  checkInDate: Date;

  checkOutDate: Date;

  totalPrice: string;

  reservationStatus: reservation_status;

  paymentStatus: payment_status | null;
}

export interface ReservationListResponseDto {
  message: string;

  data: ReservationListItemDto[];
}