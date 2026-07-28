export type SalesReportSortBy =
  | "check_in"
  | "created_at"
  | "total_price";

export interface SalesReportQueryDto {
  page?: number;
  limit?: number;

  propertyId?: number;

  startDate?: Date;
  endDate?: Date;

  sortBy?: SalesReportSortBy;
  order?: "asc" | "desc";
}