import { Request, Response } from "express";

import { tenantPropertyService } from "../services/tenant-property.service";

import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";

import type { PropertyQueryDto } from "../types/dto/property/property-query.dto";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class TenantPropertyController {
  createProperty = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);
      const data = req.body as CreatePropertyInput;

      const property =
        await tenantPropertyService.createProperty(
          tenantId,
          data,
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Property created successfully",
          serializeBigInt(property),
        ),
      );
    },
  );

  getMyProperties = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const query: PropertyQueryDto = {
        page: req.query.page
          ? Number(req.query.page)
          : undefined,

        pageSize: req.query.pageSize
          ? Number(req.query.pageSize)
          : undefined,

        search:
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,

        category:
          typeof req.query.category === "string"
            ? req.query.category
            : undefined,

        sortBy:
          typeof req.query.sortBy === "string"
            ? (req.query.sortBy as PropertyQueryDto["sortBy"])
            : undefined,

        order:
          typeof req.query.order === "string"
            ? (req.query.order as PropertyQueryDto["order"])
            : undefined,
      };

      const result =
        await tenantPropertyService.getMyProperties(
          tenantId,
          query,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant properties retrieved successfully",
          serializeBigInt(result),
        ),
      );
    },
  );

  getMyProperty = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const property =
        await tenantPropertyService.getMyProperty(
          tenantId,
          propertyId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant property retrieved successfully",
          serializeBigInt(property),
        ),
      );
    },
  );

  updateProperty = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const data = req.body as UpdatePropertyInput;

      const property =
        await tenantPropertyService.updateProperty(
          tenantId,
          propertyId,
          data,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property updated successfully",
          serializeBigInt(property),
        ),
      );
    },
  );

  deleteProperty = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await tenantPropertyService.deleteProperty(
        tenantId,
        propertyId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property deleted successfully",
          null,
        ),
      );
    },
  );

  publishProperty = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const property =
        await tenantPropertyService.publishProperty(
          tenantId,
          propertyId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property published successfully",
          serializeBigInt(property),
        ),
      );
    },
  );
}

export const tenantPropertyController =
  new TenantPropertyController();