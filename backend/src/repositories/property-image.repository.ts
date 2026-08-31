import prisma from "../config/prisma";

export class PropertyImageRepository {
  async createMany(
    propertyId: bigint,
    images: {
      imageUrl: string;
      displayOrder: number;
    }[],
  ) {
    return prisma.property_images.createMany({
      data: images.map((image) => ({
        property_id: propertyId,
        image_url: image.imageUrl,
        display_order: image.displayOrder,
      })),
    });
  }

  async findByPropertyId(propertyId: bigint) {
    return prisma.property_images.findMany({
      where: {
        property_id: propertyId,
      },
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async findById(
    imageId: bigint,
    propertyId: bigint,
  ) {
    return prisma.property_images.findFirst({
      where: {
        id: imageId,
        property_id: propertyId,
      },
    });
  }

  async delete(
    imageId: bigint,
    propertyId: bigint,
  ) {
    return prisma.property_images.delete({
      where: {
        id: imageId,
        property_id: propertyId,
      },
    });
  }
}

export const propertyImageRepository =
  new PropertyImageRepository();