import { propertyCategoryRepository } from "../repositories/property-category.repository";
import { ApiError } from "../utils/core";

import {
  CreatePropertyCategoryInput,
  UpdatePropertyCategoryInput,
} from "../validations/property";

export class PropertyCategoryService {
  async getAll() {
    const categories =
      await propertyCategoryRepository.findAll();

    return categories.map((category) => ({
      id: category.id.toString(),
      name: category.name,
    }));
  }

  async getById(id: string) {
    const category =
      await propertyCategoryRepository.findById(
        BigInt(id),
      );

    if (!category) {
      throw new ApiError(
        404,
        "Property category not found",
      );
    }

    return {
      id: category.id.toString(),
      name: category.name,
    };
  }

  async create(data: CreatePropertyCategoryInput) {
    const existing =
      await propertyCategoryRepository.findByName(
        data.name,
      );

    if (existing) {
      throw new ApiError(
        409,
        "Property category already exists",
      );
    }

    const category =
      await propertyCategoryRepository.create(data);

    return {
      id: category.id.toString(),
      name: category.name,
    };
  }

  async update(
    id: string,
    data: UpdatePropertyCategoryInput,
  ) {
    const categoryId = BigInt(id);

    const existing =
      await propertyCategoryRepository.findById(
        categoryId,
      );

    if (!existing) {
      throw new ApiError(
        404,
        "Property category not found",
      );
    }

    const duplicate =
      await propertyCategoryRepository.findByName(
        data.name,
      );

    if (
      duplicate &&
      duplicate.id !== categoryId
    ) {
      throw new ApiError(
        409,
        "Property category already exists",
      );
    }

    const updated =
      await propertyCategoryRepository.update(
        categoryId,
        data,
      );

    return {
      id: updated.id.toString(),
      name: updated.name,
    };
  }

  async delete(id: string) {
    const categoryId = BigInt(id);

    const category =
      await propertyCategoryRepository.findById(
        categoryId,
      );

    if (!category) {
      throw new ApiError(
        404,
        "Property category not found",
      );
    }

    const propertyCount =
      await propertyCategoryRepository.countProperties(
        categoryId,
      );

    if (propertyCount > 0) {
      throw new ApiError(
        409,
        "Property category cannot be deleted because it is being used by properties",
      );
    }

    await propertyCategoryRepository.delete(
      categoryId,
    );

    return null;
  }
}

export const propertyCategoryService =
  new PropertyCategoryService();