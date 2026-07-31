import prisma from "../config/prisma";

export class PropertyRepository {
  async findAllProperties() {
    return prisma.properties.findMany({
      where: {
        deleted_at: null,
      },

      orderBy: {
        created_at: "desc",
      },

      select: {
        id: true,
        name: true,

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
            display_order: true,
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
}

export const propertyRepository = new PropertyRepository();