import { propertyRepository } from "../repositories/property.repository";
import { PropertyCardDto } from "../types/dto/property";

export class PropertyService {
  async getAllProperties(): Promise<PropertyCardDto[]> {
    const properties = await propertyRepository.findAllProperties();

    return properties.map((property) => {
      const startingPrice =
        property.rooms.length > 0
          ? Math.min(
              ...property.rooms.map((room) => Number(room.base_price))
            )
          : null;

      const reviewCount = property.reviews.length;

      const rating =
        reviewCount > 0
          ? Number(
              (
                property.reviews.reduce(
                  (total, review) => total + review.rating,
                  0
                ) / reviewCount
              ).toFixed(1)
            )
          : 0;

      const thumbnail = property.property_images[0]?.image_url ?? null;

      return {
        id: property.id.toString(),
        name: property.name,
        destination: {
          city: property.destinations.city,
          province: property.destinations.province,
        },
        thumbnail,
        startingPrice,
        rating,
        reviewCount,
      };
    });
  }
}

export const propertyService = new PropertyService();