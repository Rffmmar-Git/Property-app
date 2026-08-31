import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/core";

import {
  createPropertyCategorySchema,
  updatePropertyCategorySchema,
} from "../validations/property";

import { propertyCategoryService } from "../services/property-category.service";

const getIdParam = (req: Request) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new ApiError(
      400,
      "Invalid property category ID",
    );
  }

  return id;
};

export class PropertyCategoryController {
  getAll = asyncHandler(
    async (_req: Request, res: Response) => {
      const result =
        await propertyCategoryService.getAll();

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property categories retrieved successfully",
          result,
        ),
      );
    },
  );

  getById = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getIdParam(req);

      const result =
        await propertyCategoryService.getById(id);

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property category retrieved successfully",
          result,
        ),
      );
    },
  );

  create = asyncHandler(
    async (req: Request, res: Response) => {
      const data =
        createPropertyCategorySchema.parse(
          req.body,
        );

      const result =
        await propertyCategoryService.create(data);

      return res.status(201).json(
        new ApiResponse(
          true,
          "Property category created successfully",
          result,
        ),
      );
    },
  );

  update = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getIdParam(req);

      const data =
        updatePropertyCategorySchema.parse(
          req.body,
        );

      const result =
        await propertyCategoryService.update(
          id,
          data,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property category updated successfully",
          result,
        ),
      );
    },
  );

  delete = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getIdParam(req);

      await propertyCategoryService.delete(id);

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property category deleted successfully",
          null,
        ),
      );
    },
  );
}

export const propertyCategoryController =
  new PropertyCategoryController();