export type PropertySortBy = "created_at" | "name" | "price";

export type PropertySortOrder = "asc" | "desc";

export interface PropertyQueryDto {
  page?: number;
  pageSize?: number;

  search?: string;
  category?: string;
  city?: string;

  checkIn?: string;
  duration?: number;

  sortBy?: PropertySortBy;
  order?: PropertySortOrder;
}