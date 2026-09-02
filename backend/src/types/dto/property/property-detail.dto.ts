export interface PropertyDetailDto {
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

  images: {
    imageUrl: string;

    displayOrder: number;
  }[];

  rooms: {
    id: string;

    name: string;

    description: string | null;

    capacity: number;

    basePrice: number;
  }[];

  priceCalendar: {
    date: string;

    price: number | null;

    available: boolean;
  }[];
}