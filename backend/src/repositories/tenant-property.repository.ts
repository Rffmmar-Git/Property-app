import prisma from "../config/prisma";
import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";
import type {
  PropertyQueryDto,
  PropertySortBy,
  PropertySortOrder,
} from "../types/dto/property/property-query.dto";

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
        status: "DRAFT",
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
    query: PropertyQueryDto = {},
  ) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where = {
      tenant_id: tenantId,
      deleted_at: null,
      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: "insensitive" as const,
                },
              },
              {
                destinations: {
                  city: {
                    contains: query.search,
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
      ...(query.category
        ? {
            property_categories: {
              name: {
                contains: query.category,
                mode: "insensitive" as const,
              },
            },
          }
        : {}),
    };

    const orderBy = this.buildOrderBy(
      query.sortBy,
      query.order,
    );

    const [properties, totalItems] = await prisma.$transaction([
      prisma.properties.findMany({
        where,
        include: {
          property_categories: true,
          destinations: true,
          property_images: {
            orderBy: {
              display_order: "asc",
            },
            take: 1,
          },
          rooms: {
            where: {
              deleted_at: null,
            },
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.properties.count({
        where,
      }),
    ]);

    return {
      properties,
      totalItems,
    };
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
        ...(data.categoryId !== undefined && {
          category_id: BigInt(data.categoryId),
        }),
        ...(data.destinationId !== undefined && {
          destination_id: BigInt(data.destinationId),
        }),
        ...(data.name !== undefined && {
          name: data.name,
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
          check_in_time: data.checkInTime
            ? timeToUtcDate(data.checkInTime)
            : null,
        }),
        ...(data.checkOutTime !== undefined && {
          check_out_time: data.checkOutTime
            ? timeToUtcDate(data.checkOutTime)
            : null,
        }),
      },
    });
  }

  async publishProperty(id: bigint) {
    return prisma.properties.update({
      where: {
        id,
      },
      data: {
        status: "PUBLISHED",
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
      },
    });
  }

  private buildOrderBy(
    sortBy?: PropertySortBy,
    order?: PropertySortOrder,
  ) {
    const direction = order ?? "desc";

    switch (sortBy) {
      case "name":
        return {
          name: direction,
        };

      case "created_at":
      default:
        return {
          created_at: direction,
        };
    }
  }
}

export const tenantPropertyRepository =
  new TenantPropertyRepository();