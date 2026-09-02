import { api } from "../../../services/api/axios";

export interface PropertyDetailImage {
  imageUrl: string;
  displayOrder: number;
}

export interface PropertyDetailRoom {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  basePrice: number;
}

export interface PropertyPriceCalendar {
  date: string;
  price: number | null;
  available: boolean;
}

export interface PropertyDetail {
  id: string;
  name: string;
  description: string | null;
  address: string;

  latitude: number | null;
  longitude: number | null;

  checkInTime: string | null;
  checkOutTime: string | null;

  category: string;

  destination: {
    city: string;
    province: string;
  };

  images: PropertyDetailImage[];

  rooms: PropertyDetailRoom[];

  priceCalendar: PropertyPriceCalendar[];
}

export interface GetPropertyDetailParams {
  roomId?: string;
}

export const getPropertyDetail = async (
  propertyId: string,
  params: GetPropertyDetailParams = {},
): Promise<PropertyDetail> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: PropertyDetail;
  }>(`/properties/${propertyId}`, {
    params: {
      roomId: params.roomId || undefined,
    },
  });

  return response.data.data;
};