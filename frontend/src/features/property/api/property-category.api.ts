import { api } from "../../../services/api/axios";

export interface PropertyCategory {
  id: string;
  name: string;
}

export const getPropertyCategories = async (): Promise<
  PropertyCategory[]
> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: PropertyCategory[];
  }>("/properties/categories");

  return response.data.data;
};