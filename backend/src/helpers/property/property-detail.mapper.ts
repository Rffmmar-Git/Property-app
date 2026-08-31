import { Prisma } from "../../generated/prisma/client";
import { PropertyDetailDto } from "../../types/dto/property";

type PropertyDetailSource = {
  id: bigint;
  name: string;
  description: string | null;
  address: string;

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

export function mapPropertyDetail(
  property: PropertyDetailSource
): PropertyDetailDto {
  return {
    id: property.id.toString(),
    name: property.name,
    description: property.description,
    address: property.address,

    checkInTime:
      property.check_in_time?.toISOString() ?? null,

    checkOutTime:
      property.check_out_time?.toISOString() ?? null,

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