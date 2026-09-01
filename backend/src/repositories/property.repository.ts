import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { PropertyQueryDto } from "../types/dto/property";

export class PropertyRepository {
  async findAllProperties(query: PropertyQueryDto) {
    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query);

    const [properties, totalItems] =
      await prisma.$transaction([
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
            total_rooms: true,

            room_availabilities: {
              select: {
                available_date: true,
                available_rooms: true,
                is_closed: true,
              },
            },

            reservations: {
              where: {
                status: {
                  in: [
                    "WAITING_PAYMENT",
                    "WAITING_CONFIRMATION",
                    "CONFIRMED",
                  ],
                },
              },

              select: {
                check_in: true,
                check_out: true,
                status: true,
              },
            },

            peak_season_rates: {
              select: {
                start_date: true,
                end_date: true,
                adjustment_type: true,
                adjustment_value: true,
              },
            },
          },
        },
      },
    });
  }

  private getDateRange(query: PropertyQueryDto) {
    if (
      !query.checkIn ||
      !query.duration ||
      query.duration <= 0
    ) {
      return null;
    }

    const checkIn = new Date(
      `${query.checkIn}T00:00:00.000Z`,
    );

    if (Number.isNaN(checkIn.getTime())) {
      return null;
    }

    const checkOut = new Date(checkIn);

    checkOut.setUTCDate(
      checkOut.getUTCDate() + query.duration,
    );

    return {
      checkIn,
      checkOut,
    };
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
    if (query.sortBy === "price") {
      return {
        created_at: "desc",
      };
    }

    return {
      [query.sortBy ?? "created_at"]:
        query.order ?? "desc",
    };
  }

  private findProperties(
    query: PropertyQueryDto,
    where: Prisma.propertiesWhereInput,
    orderBy: Prisma.propertiesOrderByWithRelationInput,
  ) {
    const dateRange = this.getDateRange(query);

    const requiresPostProcessing =
      dateRange !== null ||
      query.sortBy === "price";

    return prisma.properties.findMany({
      where,
      orderBy,

      skip: requiresPostProcessing
        ? undefined
        : ((query.page ?? 1) - 1) *
          (query.pageSize ?? 10),

      take: requiresPostProcessing
        ? undefined
        : query.pageSize ?? 10,

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
          where: {
            deleted_at: null,

            ...(dateRange
              ? {
                  room_availabilities: {
                    none: {
                      is_closed: true,

                      available_date: {
                        gte: dateRange.checkIn,
                        lt: dateRange.checkOut,
                      },
                    },
                  },
                }
              : {}),
          },

          select: {
            id: true,
            base_price: true,
            total_rooms: true,

            room_availabilities: {
              where: dateRange
                ? {
                    available_date: {
                      gte: dateRange.checkIn,
                      lt: dateRange.checkOut,
                    },
                  }
                : undefined,

              select: {
                available_date: true,
                available_rooms: true,
                is_closed: true,
              },
            },

            reservations: {
              where: dateRange
                ? {
                    status: {
                      in: [
                        "WAITING_PAYMENT",
                        "WAITING_CONFIRMATION",
                        "CONFIRMED",
                      ],
                    },

                    check_in: {
                      lt: dateRange.checkOut,
                    },

                    check_out: {
                      gt: dateRange.checkIn,
                    },
                  }
                : undefined,

              select: {
                check_in: true,
                check_out: true,
                guest_count: true,
                status: true,
              },
            },

            peak_season_rates: {
              where: dateRange
                ? {
                    start_date: {
                      lt: dateRange.checkOut,
                    },

                    end_date: {
                      gte: dateRange.checkIn,
                    },
                  }
                : undefined,

              select: {
                start_date: true,
                end_date: true,
                adjustment_type: true,
                adjustment_value: true,
              },
            },
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

  private countProperties(
    where: Prisma.propertiesWhereInput,
  ) {
    return prisma.properties.count({
      where,
    });
  }
}

export const propertyRepository =
  new PropertyRepository();