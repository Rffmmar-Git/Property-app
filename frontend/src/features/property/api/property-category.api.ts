import { api } from "../../../services/api/axios";

export interface PropertyCategory {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PropertyCategoryPayload {
  name: string;
}

export const getPropertyCategories = async (): Promise<
  PropertyCategory[]
> => {
  const response = await api.get<
    ApiResponse<PropertyCategory[]>
  >("/properties/categories");

  return response.data.data;
};

export const createPropertyCategory = async (
  data: PropertyCategoryPayload,
): Promise<PropertyCategory> => {
  const response = await api.post<
    ApiResponse<PropertyCategory>
  >("/properties/categories", data);

  return response.data.data;
};

export const updatePropertyCategory = async (
  id: string,
  data: PropertyCategoryPayload,
): Promise<PropertyCategory> => {
  const response = await api.patch<
    ApiResponse<PropertyCategory>
  >(`/properties/categories/${id}`, data);

  return response.data.data;
};

export const deletePropertyCategory = async (
  id: string,
): Promise<null> => {
  const response = await api.delete<
    ApiResponse<null>
  >(`/properties/categories/${id}`);

  return response.data.data;
};