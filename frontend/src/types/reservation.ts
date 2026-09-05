import { PaymentStatus } from "./payment";

export type ReservationStatus =
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export interface ReservationDetail {
  id: number;
  bookingCode: string;
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: string;
  reservationStatus: ReservationStatus;
  status?: ReservationStatus;
  paymentStatus: PaymentStatus | null;
  paymentProof?: string | null;
}

