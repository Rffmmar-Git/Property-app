import { propertyRepository } from "../repositories/property.repository";
import { mapPropertyListResponse } from "../helpers/property/property-card.mapper";
import { mapPropertyDetail } from "../helpers/property/property-detail.mapper";
import { ApiError } from "../utils/core/ApiError";
import {
  PropertyListResponseDto,
  PropertyQueryDto,
  PropertySortBy,
  PropertySortOrder,
} from "../types/dto/property";

export class PropertyService {
  async getAllProperties(
    query: PropertyQueryDto
  ): Promise<PropertyListResponseDto> {
    const page =
      query.page && query.page > 0 ? query.page : 1;

    const pageSize =
      query.pageSize && query.pageSize > 0
        ? Math.min(query.pageSize, 50)
        : 10;

    const allowedSortBy: PropertySortBy[] = [
      "created_at",
      "name",
    ];

    const sortBy = allowedSortBy.includes(
      query.sortBy as PropertySortBy
    )
      ? (query.sortBy as PropertySortBy)
      : "created_at";

    const order: PropertySortOrder =
      query.order === "asc" || query.order === "desc"
        ? query.order
        : "desc";

    const { properties, totalItems } =
      await propertyRepository.findAllProperties({
        ...query,
        page,
        pageSize,
        sortBy,
        order,
      });

    return mapPropertyListResponse(properties, {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  }

  async getPropertyById(id: string) {
    const property = await propertyRepository.findPropertyById(
      BigInt(id)
    );

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    return mapPropertyDetail(property);
  }
}

export const propertyService = new PropertyService();