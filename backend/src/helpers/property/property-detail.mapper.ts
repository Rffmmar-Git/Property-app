import { Prisma } from "../../generated/prisma/client";
import { PropertyDetailDto } from "../../types/dto/property";

type PropertyDetailSource = {
  id: bigint;
  name: string;
  description: string | null;
  address: string;

  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;

  check_in_time: Date | null;
  check_out_time: Date | null;

  property_categories: {
    name: string;
  };

  destinations: {
    city: string;
    province: string;
  };

  property_images: {
    image_url: string;
    display_order: number;
  }[];

  rooms: {
    id: bigint;
    room_name: string;
    description: string | null;
    capacity: number;
    base_price: Prisma.Decimal;
  }[];

  priceCalendar: {
    date: string;
    price: number | null;
    available: boolean;
  }[];
};

const formatTime = (value: Date | null): string | null => {
  if (!value) return null;

  const hours = String(value.getUTCHours()).padStart(2, "0");
  const minutes = String(value.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export function mapPropertyDetail(
  property: PropertyDetailSource,
): PropertyDetailDto {
  return {
    id: property.id.toString(),
    name: property.name,
    description: property.description,
    address: property.address,

    latitude:
      property.latitude !== null
        ? Number(property.latitude)
        : null,

    longitude:
      property.longitude !== null
        ? Number(property.longitude)
        : null,

    checkInTime: formatTime(property.check_in_time),

    checkOutTime: formatTime(property.check_out_time),

    category: property.property_categories.name,

    destination: {
      city: property.destinations.city,
      province: property.destinations.province,
    },

    images: property.property_images.map((image) => ({
      imageUrl: image.image_url,
      displayOrder: image.display_order,
    })),

    rooms: property.rooms.map((room) => ({
      id: room.id.toString(),
      name: room.room_name,
      description: room.description,
      capacity: room.capacity,
      basePrice: Number(room.base_price),
    })),

    priceCalendar: property.priceCalendar,
  };
}