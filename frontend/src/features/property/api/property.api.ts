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
    },
  });

  return response.data.data;
};