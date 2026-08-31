import { Request, Response } from "express";

import { propertyImageService } from "../services/property-image.service";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class PropertyImageController {
  uploadImages = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const files = req.files as Express.Multer.File[];

      const images =
        await propertyImageService.uploadImages(
          tenantId,
          propertyId,
          files ?? [],
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Property images uploaded successfully",
          serializeBigInt(images),
        ),
      );
    },
  );

  getPropertyImages = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const images =
        await propertyImageService.getPropertyImages(
          tenantId,
          propertyId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property images retrieved successfully",
          serializeBigInt(images),
        ),
      );
    },
  );

  deleteImage = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const imageId = Array.isArray(req.params.imageId)
        ? req.params.imageId[0]
        : req.params.imageId;

      await propertyImageService.deleteImage(
        tenantId,
        propertyId,
        imageId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property image deleted successfully",
          null,
        ),
      );
    },
  );
}

export const propertyImageController =
  new PropertyImageController();