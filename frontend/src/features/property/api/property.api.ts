import { api } from "../../../services/api/axios";

export interface PropertyDestination {
  city: string;
  province: string;
}

export interface Property {
  id: string;
  name: string;
  destination: PropertyDestination;
  thumbnail: string | null;
  startingPrice: number;
  rating: number;
  reviewCount: number;
}

export interface PropertyPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PropertyListResponse {
  items: Property[];
  pagination: PropertyPagination;
}

export interface GetPropertiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  city?: string;
  checkIn?: string;
  duration?: number;
  sortBy?: "created_at" | "name" | "price";
  order?: "asc" | "desc";
}

export const getProperties = async (
  params: GetPropertiesParams = {},
): Promise<PropertyListResponse> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: PropertyListResponse;
  }>("/properties", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
      search: params.search || undefined,
      category: params.category || undefined,
      city: params.city || undefined,
      checkIn: params.checkIn || undefined,
      duration: params.duration || undefined,
      sortBy: params.sortBy || undefined,
      order: params.order || undefined,
    },
  });

  return response.data.data;
};