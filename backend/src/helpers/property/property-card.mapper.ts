import { Prisma } from "../../generated/prisma/client";
import {
  PaginationDto,
  PropertyCardDto,
  PropertyListResponseDto,
} from "../../types/dto/property";

type PropertyCardSource = {
  id: bigint;
  name: string;
  destinations: {
    city: string;
    province: string;
  };
  property_images: {
    image_url: string;
  }[];
  rooms: {
    base_price: Prisma.Decimal;
  }[];
  reviews: {
    rating: number;
  }[];
};

function calculateStartingPrice(
  rooms: PropertyCardSource["rooms"]
): number | null {
  if (!rooms.length) return null;

  return Math.min(...rooms.map((room) => Number(room.base_price)));
}

function calculateAverageRating(
  reviews: PropertyCardSource["reviews"]
): number {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return Number((total / reviews.length).toFixed(1));
}

export function mapPropertyCard(
  property: PropertyCardSource
): PropertyCardDto {
  return {
    id: property.id.toString(),
    name: property.name,
    destination: {
      city: property.destinations.city,
      province: property.destinations.province,
    },
    thumbnail: property.property_images[0]?.image_url ?? null,
    startingPrice: calculateStartingPrice(property.rooms),
    rating: calculateAverageRating(property.reviews),
    reviewCount: property.reviews.length,
  };
}

export function mapPropertyCards(
  properties: PropertyCardSource[]
): PropertyCardDto[] {
  return properties.map(mapPropertyCard);
}

export function mapPropertyListResponse(
  properties: PropertyCardSource[],
  pagination: PaginationDto
): PropertyListResponseDto {
  return {
    items: mapPropertyCards(properties),
    pagination,
  };
}