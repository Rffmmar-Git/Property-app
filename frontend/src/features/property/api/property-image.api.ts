import { api } from "../../../services/api/axios";

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  created_at: string | null;
  display_order: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPropertyImages = async (
  propertyId: string,
): Promise<PropertyImage[]> => {
  const response = await api.get<ApiResponse<PropertyImage[]>>(
    `/tenant/properties/${propertyId}/images`,
  );

  return response.data.data;
};

export const uploadPropertyImages = async (
  propertyId: string,
  files: File[],
): Promise<PropertyImage[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post<ApiResponse<PropertyImage[]>>(
    `/tenant/properties/${propertyId}/images`,
    formData,
  );

  return response.data.data;
};

export const deletePropertyImage = async (
  propertyId: string,
  imageId: string,
): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(
    `/tenant/properties/${propertyId}/images/${imageId}`,
  );

  return response.data.data;
};