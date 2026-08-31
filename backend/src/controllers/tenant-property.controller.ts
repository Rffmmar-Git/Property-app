import { Request, Response } from "express";

import { tenantPropertyService } from "../services/tenant-property.service";

import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../validations/property";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class TenantPropertyController {
  createProperty = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = BigInt(req.user!.id);
    const data = req.body as CreatePropertyInput;

    const property = await tenantPropertyService.createProperty(
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
  });

  getMyProperties = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = BigInt(req.user!.id);

    const properties = await tenantPropertyService.getMyProperties(
      tenantId,
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Tenant properties retrieved successfully",
        serializeBigInt(properties),
      ),
    );
  });

  getMyProperty = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = BigInt(req.user!.id);

    const propertyId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const property = await tenantPropertyService.getMyProperty(
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
  });

  updateProperty = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = BigInt(req.user!.id);

    const propertyId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const data = req.body as UpdatePropertyInput;

    const property = await tenantPropertyService.updateProperty(
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
  });

  deleteProperty = asyncHandler(async (req: Request, res: Response) => {
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
  });
}

export const tenantPropertyController =
  new TenantPropertyController();