import { ApiError } from "../utils/core";
import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";
import { tenantPropertyRepository } from "../repositories/tenant-property.repository";

export class TenantPropertyService {
  async createProperty(
    tenantId: bigint,
    data: CreatePropertyInput,
  ) {
    return tenantPropertyRepository.createProperty(
      tenantId,
      data,
    );
  }

  async getMyProperties(tenantId: bigint) {
    return tenantPropertyRepository.findPropertiesByTenant(
      tenantId,
    );
  }

  async getMyProperty(
    tenantId: bigint,
    propertyId: string,
  ) {
    const id = this.parsePropertyId(propertyId);

    const property =
      await tenantPropertyRepository.findPropertyByIdAndTenant(
        id,
        tenantId,
      );

    if (!property) {
      throw new ApiError(
        404,
        "Property not found",
      );
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

    return tenantPropertyRepository.updateProperty(
      id,
      data,
    );
  }

  async deleteProperty(
    tenantId: bigint,
    propertyId: string,
  ) {
    const id = this.parsePropertyId(propertyId);

    await this.ensureOwnership(id, tenantId);

    await tenantPropertyRepository.softDeleteProperty(
      id,
    );
  }

  private async ensureOwnership(
    propertyId: bigint,
    tenantId: bigint,
  ) {
    const property =
      await tenantPropertyRepository.findPropertyByIdAndTenant(
        propertyId,
        tenantId,
      );

    if (!property) {
      throw new ApiError(
        404,
        "Property not found",
      );
    }

    return property;
  }

  private parsePropertyId(propertyId: string) {
    try {
      return BigInt(propertyId);
    } catch {
      throw new ApiError(
        400,
        "Invalid property ID",
      );
    }
  }
}

export const tenantPropertyService =
  new TenantPropertyService();