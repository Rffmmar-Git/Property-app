export type TransactionReportSortBy =
  | "created_at"
  | "booking_code"
  | "status"
  | "total_price";

export interface TransactionReportQueryDto {
  page?: number;
  limit?: number;

  propertyId?: number;

  startDate?: Date;
  endDate?: Date;

  sortBy?: TransactionReportSortBy;
  order?: "asc" | "desc";
}