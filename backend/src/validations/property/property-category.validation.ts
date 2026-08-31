import { z } from "zod";

export const createPropertyCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),
});

export type CreatePropertyCategoryInput = z.infer<
  typeof createPropertyCategorySchema
>;

export const updatePropertyCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),
});

export type UpdatePropertyCategoryInput = z.infer<
  typeof updatePropertyCategorySchema
>;