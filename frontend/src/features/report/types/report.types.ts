import type { PaymentStatus } from "@/types/payment";
import type { ReservationStatus } from "@/types/reservation";

export interface ReportUser {
  id: number;
  fullName: string;
  email: string;
}

export interface ReportProperty {
  id: number;
  name: string;
}

export interface ReportRoom {
  id: number;
  roomName: string;
}

export interface ReportPayment {
  id: number;
  paymentMethod: string;
  paymentAmount: number;
  status: PaymentStatus;
  paidAt: string | null;
}

/**
 * Sales Report
 */

export interface SalesReportItem {
  id: number;
  bookingCode: string;

  user: ReportUser;

  property: ReportProperty;

  room: ReportRoom;

  checkIn: string;
  checkOut: string;

  totalPrice: number;

  payment: ReportPayment | null;
}

export interface SalesReportQuery {
  page: number;
  limit: number;
  propertyId?: number;
  startDate?: string;
  endDate?: string;
  sortBy:
    | "check_in"
    | "created_at"
    | "total_price";
  order: "asc" | "desc";
}

/**
 * Transaction Report
 */

export interface TransactionReportItem {
  id: number;
  bookingCode: string;
  status: ReservationStatus;

  user: ReportUser;

  property: ReportProperty;

  room: ReportRoom;

  checkIn: string;
  checkOut: string;

  totalPrice: number;

  createdAt: string;

  payment: ReportPayment | null;
}

export interface TransactionReportQuery {
  page: number;
  limit: number;
  propertyId?: number;
  startDate?: string;
  endDate?: string;
  sortBy:
    | "created_at"
    | "booking_code"
    | "status"
    | "total_price";
  order: "asc" | "desc";
}

/**
 * Property Report
 */

export interface PropertyReportRoom {
  id: number;
  roomName: string;
  totalRooms: number;
  basePrice: number;
}

export interface PropertyReportItem {
  id: number;
  availableDate: string;
  availableRooms: number;
  isClosed: boolean;
  closureReason: string | null;

  room: PropertyReportRoom;

  property: ReportProperty;
}

export interface PropertyReportQuery {
  propertyId?: number;
  month?: number;
  year?: number;
}

/**
 * Pagination
 */

export interface ReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}