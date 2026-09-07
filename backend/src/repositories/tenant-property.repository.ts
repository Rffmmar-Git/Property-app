import prisma from "../config/prisma";

import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";

const timeToUtcDate = (time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
};

export class TenantPropertyRepository {
  async createProperty(
    tenantId: bigint,
    data: CreatePropertyInput,
  ) {
    return prisma.properties.create({
      data: {
        tenant_id: tenantId,
        category_id: BigInt(data.categoryId),
        destination_id: BigInt(data.destinationId),
        name: data.name,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,

        check_in_time: data.checkInTime
          ? timeToUtcDate(data.checkInTime)
          : undefined,

        check_out_time: data.checkOutTime
          ? timeToUtcDate(data.checkOutTime)
          : undefined,
      },
    });
  }

  async findPropertyByIdAndTenant(
    id: bigint,
    tenantId: bigint,
  ) {
    return prisma.properties.findFirst({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },

      include: {
        property_categories: true,
        destinations: true,

        property_images: {
          orderBy: {
            display_order: "asc",
          },
        },

        rooms: {
          where: {
            deleted_at: null,
          },
        },
      },
    });
  }

  async findPropertiesByTenant(
    tenantId: bigint,
  ) {
    return prisma.properties.findMany({
      where: {
        tenant_id: tenantId,
        deleted_at: null,
      },

      include: {
        property_categories: true,
        destinations: true,

        property_images: {
          orderBy: {
            display_order: "asc",
          },
        },

        rooms: {
          where: {
            deleted_at: null,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });
  }

  async updateProperty(
    id: bigint,
    data: UpdatePropertyInput,
  ) {
    return prisma.properties.update({
      where: {
        id,
      },

      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.categoryId !== undefined && {
          category_id: BigInt(data.categoryId),
        }),

        ...(data.destinationId !== undefined && {
          destination_id: BigInt(data.destinationId),
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.address !== undefined && {
          address: data.address,
        }),

        ...(data.latitude !== undefined && {
          latitude: data.latitude,
        }),

        ...(data.longitude !== undefined && {
          longitude: data.longitude,
        }),

        ...(data.checkInTime !== undefined && {
          check_in_time: timeToUtcDate(data.checkInTime),
        }),

        ...(data.checkOutTime !== undefined && {
          check_out_time: timeToUtcDate(data.checkOutTime),
        }),

        updated_at: new Date(),
      },
    });
  }

  async softDeleteProperty(id: bigint) {
    return prisma.properties.update({
      where: {
        id,
      },

      data: {
        deleted_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
}

export const tenantPropertyRepository =
  new TenantPropertyRepository();