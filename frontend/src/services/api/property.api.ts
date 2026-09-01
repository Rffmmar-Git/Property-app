import { api } from "./axios";

export type CreatePropertyPayload = {
  name: string;
  description: string;
  destinationId: string;
  categoryId: string;
  address: string;
  latitude: number;
  longitude: number;
  rooms: {
    name: string;
    capacity: number;
    basePrice: number;
  }[];
};

export const createProperty = async (
  payload: CreatePropertyPayload,
) => {
  const response = await api.post("/properties", payload);

  return response.data;
};