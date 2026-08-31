import prisma from "../config/prisma";

import {
  CreatePropertyCategoryInput,
  UpdatePropertyCategoryInput,
} from "../validations/property";

export class PropertyCategoryRepository {
  async findAll() {
    return prisma.property_categories.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: bigint) {
    return prisma.property_categories.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return prisma.property_categories.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data: CreatePropertyCategoryInput) {
    return prisma.property_categories.create({
      data: {
        name: data.name,
      },
    });
  }

  async update(
    id: bigint,
    data: UpdatePropertyCategoryInput,
  ) {
    return prisma.property_categories.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }

  async countProperties(id: bigint) {
    return prisma.properties.count({
      where: {
        category_id: id,
        deleted_at: null,
      },
    });
  }

  async delete(id: bigint) {
    return prisma.property_categories.delete({
      where: {
        id,
      },
    });
  }
}

export const propertyCategoryRepository =
  new PropertyCategoryRepository();