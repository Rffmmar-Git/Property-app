import { api } from "../../../services/api/axios";

export interface HomeProperty {
  id: string;
  name: string;
  destination: {
    city: string;
    province: string;
  };
  thumbnail: string | null;
  startingPrice: number;
  rating: number;
  reviewCount: number;
}

export interface HomePropertiesResponse {
  items: HomeProperty[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetHomePropertiesParams {
  page?: number;
  pageSize?: number;
}

export const getHomeProperties = async (
  params: GetHomePropertiesParams = {},
): Promise<HomePropertiesResponse> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: HomePropertiesResponse;
  }>("/properties", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 8,
    },
  });

  return response.data.data;
};