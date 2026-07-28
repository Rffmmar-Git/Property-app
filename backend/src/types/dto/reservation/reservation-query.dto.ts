export interface ReservationQueryDto {
  page?: number;
  limit?: number;

  status?: string;

  sortBy?: string;
  order?: "asc" | "desc";

  search?: string;

  startDate?: Date;
  endDate?: Date;
}