import { ApiError } from "../utils/core";
import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";
import type { PropertyQueryDto } from "../types/dto/property/property-query.dto";
import { tenantPropertyRepository } from "../repositories/tenant-property.repository";

export class TenantPropertyService {
  async createProperty(tenantId: bigint, data: CreatePropertyInput) {
    return tenantPropertyRepository.createProperty(tenantId, data);
  }

  async getMyProperties(tenantId: bigint, query: PropertyQueryDto = {}) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    if (!Number.isInteger(page) || page < 1) {
      throw new ApiError(400, "Page must be a positive integer.");
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
      throw new ApiError(400, "Page size must be a positive integer.");
    }

    if (pageSize > 50) {
      throw new ApiError(400, "Page size cannot exceed 50.");
    }

    const allowedSortBy = ["created_at", "name"] as const;

    const requestedSortBy = query.sortBy ?? "created_at";

    if (!allowedSortBy.includes(requestedSortBy as "created_at" | "name")) {
      throw new ApiError(400, "Invalid sort field.");
    }

    const sortBy: "created_at" | "name" = requestedSortBy as
      "created_at" | "name";

    const order = query.order ?? "desc";

    if (order !== "asc" && order !== "desc") {
      throw new ApiError(400, "Invalid sort order.");
    }

    const normalizedQuery: PropertyQueryDto = {
      page,
      pageSize,
      search: query.search?.trim() || undefined,
      category: query.category?.trim() || undefined,
      sortBy,
      order,
    };

    const result = await tenantPropertyRepository.findPropertiesByTenant(
      tenantId,
      normalizedQuery,
    );

    return {
      items: result.properties,
      pagination: {
        page,
        pageSize,
        totalItems: result.totalItems,
        totalPages: Math.ceil(result.totalItems / pageSize),
      },
    };
  }

  async getMyProperty(tenantId: bigint, propertyId: string) {
    const id = this.parsePropertyId(propertyId);

    const property = await tenantPropertyRepository.findPropertyByIdAndTenant(
      id,
      tenantId,
    );

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    return property;
  }

  async updateProperty(
    tenantId: bigint,
    propertyId: string,
    data: UpdatePropertyInput,
  ) {
    const id = this.parsePropertyId(propertyId);

    await this.ensureOwnership(id, tenantId);

    return tenantPropertyRepository.updateProperty(id, data);
  }

  async deleteProperty(tenantId: bigint, propertyId: string) {
    const id = this.parsePropertyId(propertyId);

    await this.ensureOwnership(id, tenantId);

    await tenantPropertyRepository.softDeleteProperty(id);
  }

  async publishProperty(tenantId: bigint, propertyId: string) {
    const id = this.parsePropertyId(propertyId);

    const property = await this.ensureOwnership(id, tenantId);

    if (property.status === "PUBLISHED") {
      throw new ApiError(400, "This property is already published.");
    }

    const missingRequirements: string[] = [];

    if (!property.name.trim()) {
      missingRequirements.push("Add a property name.");
    }

    if (!property.description?.trim()) {
      missingRequirements.push("Add a property description.");
    }

    if (!property.address.trim()) {
      missingRequirements.push("Add the property address.");
    }

    if (property.latitude === null || property.longitude === null) {
      missingRequirements.push("Set the property location.");
    }

    if (!property.property_categories) {
      missingRequirements.push("Select a property category.");
    }

    if (!property.destinations) {
      missingRequirements.push("Select a property destination.");
    }

    if (property.property_images.length === 0) {
      missingRequirements.push("Add at least one property image.");
    }

    if (property.rooms.length === 0) {
      missingRequirements.push("Add at least one room type.");
    } else {
      const invalidRoomQuantity = property.rooms.find(
        (room) => room.total_rooms <= 0,
      );

      if (invalidRoomQuantity) {
        missingRequirements.push(
          `Room "${invalidRoomQuantity.room_name}" must have at least 1 room.`,
        );
      }

      const invalidRoomPrice = property.rooms.find(
        (room) => Number(room.base_price) <= 0,
      );

      if (invalidRoomPrice) {
        missingRequirements.push(
          `Room "${invalidRoomPrice.room_name}" must have a base price greater than 0.`,
        );
      }
    }

    if (missingRequirements.length > 0) {
      throw new ApiError(
        400,
        `This property is not ready to be published. Please complete the following: ${missingRequirements.join(
          " ",
        )}`,
      );
    }

    return tenantPropertyRepository.publishProperty(id);
  }

  private async ensureOwnership(propertyId: bigint, tenantId: bigint) {
    const property = await tenantPropertyRepository.findPropertyByIdAndTenant(
      propertyId,
      tenantId,
    );

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    return property;
  }

  private parsePropertyId(propertyId: string) {
    try {
      return BigInt(propertyId);
    } catch {
      throw new ApiError(400, "Invalid property ID");
    }
  }
}

export const tenantPropertyService = new TenantPropertyService();
