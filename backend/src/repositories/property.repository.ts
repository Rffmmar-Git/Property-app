import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { PropertyQueryDto } from "../types/dto/property";

export class PropertyRepository {
  async findAllProperties(query: PropertyQueryDto) {
    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query);

    const [properties, totalItems] = await prisma.$transaction([
      this.findProperties(query, where, orderBy),
      this.countProperties(where),
    ]);

    return { properties, totalItems };
  }

  async findPropertyById(id: bigint) {
    return prisma.properties.findFirst({
      where: {
        id,
        deleted_at: null,
      },

      select: {
        id: true,
        name: true,
        description: true,
        address: true,

        check_in_time: true,
        check_out_time: true,

        property_categories: {
          select: {
            name: true,
          },
        },

        destinations: {
          select: {
            city: true,
            province: true,
          },
        },

        property_images: {
          orderBy: {
            display_order: "asc",
          },
          select: {
            image_url: true,
            display_order: true,
          },
        },

        rooms: {
          where: {
            deleted_at: null,
          },

          orderBy: {
            base_price: "asc",
          },

          select: {
            id: true,
            room_name: true,
            description: true,
            capacity: true,
            base_price: true,
          },
        },
      },
    });
  }

  private buildWhereClause(
    query: PropertyQueryDto,
  ): Prisma.propertiesWhereInput {
    const where: Prisma.propertiesWhereInput = {
      deleted_at: null,
    };

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: "insensitive",
      };
    }

    if (query.city) {
      where.destinations = {
        city: {
          contains: query.city,
          mode: "insensitive",
        },
      };
    }

    if (query.category) {
      where.property_categories = {
        name: {
          contains: query.category,
          mode: "insensitive",
        },
      };
    }

    return where;
  }

  private buildOrderBy(
    query: PropertyQueryDto,
  ): Prisma.propertiesOrderByWithRelationInput {
    return {
      [query.sortBy ?? "created_at"]: query.order ?? "desc",
    };
  }

  private findProperties(
    query: PropertyQueryDto,
    where: Prisma.propertiesWhereInput,
    orderBy: Prisma.propertiesOrderByWithRelationInput,
  ) {
    return prisma.properties.findMany({
      where,
      orderBy,
      skip: ((query.page ?? 1) - 1) * (query.pageSize ?? 10),
      take: query.pageSize ?? 10,

      select: {
        id: true,
        name: true,

        property_categories: {
          select: {
            name: true,
          },
        },

        destinations: {
          select: {
            city: true,
            province: true,
          },
        },

        property_images: {
          orderBy: {
            display_order: "asc",
          },
          take: 1,
          select: {
            image_url: true,
          },
        },

        rooms: {
          select: {
            base_price: true,
          },
        },

        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
  }

  private countProperties(where: Prisma.propertiesWhereInput) {
    return prisma.properties.count({
      where,
    });
  }
}

export const propertyRepository = new PropertyRepository();
