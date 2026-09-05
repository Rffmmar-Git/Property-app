import {
  payment_status,
  reservation_status,
} from "../../../generated/prisma/client";

export interface TenantTransactionQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: payment_status;
  reservationStatus?: reservation_status;
  sortBy?:
    | "created_at"
    | "booking_code"
    | "total_price"
    | "check_in"
    | "check_out";
  order?: "asc" | "desc";
}