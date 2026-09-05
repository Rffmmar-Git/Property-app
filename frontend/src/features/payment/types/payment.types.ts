import type { PaymentStatus } from "../../../types/payment";
import type { ReservationStatus } from "@/types/reservation";

export interface TenantTransaction {
  id: number;
  bookingCode: string;
  customerName: string;
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: string;
  reservationStatus: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentProof: string | null;
  createdAt: string;
}

export interface TenantTransactionQuery {
  page: number;
  limit: number;
  search?: string;
  paymentStatus?: PaymentStatus;
  reservationStatus?: ReservationStatus;
  sortBy?:
    | "created_at"
    | "booking_code"
    | "total_price"
    | "check_in"
    | "check_out";
  order?: "asc" | "desc";
}

export interface TenantTransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TenantTransactionListResponse {
  data: TenantTransaction[];
  pagination: TenantTransactionPagination;
}