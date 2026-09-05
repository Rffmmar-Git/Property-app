import {
  payment_status,
  reservation_status,
} from "../../../generated/prisma/client";

export interface TenantTransactionDto {
  id: number;
  bookingCode: string;
  customerName: string;
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: string;
  reservationStatus: reservation_status;
  paymentStatus: payment_status;
  paymentProof: string | null;
  createdAt: string;
}

export interface TenantTransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TenantTransactionResponseDto {
  message: string;
  data: TenantTransactionDto[];
  pagination: TenantTransactionPagination;
}