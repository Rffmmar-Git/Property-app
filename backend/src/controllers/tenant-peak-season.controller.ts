import { Request, Response } from "express";

import { tenantPeakSeasonService } from "../services/tenant-peak-season.service";

import {
  CreatePeakSeasonInput,
  UpdatePeakSeasonInput,
} from "../validations/room";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class TenantPeakSeasonController {
  createRate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.roomId)
        ? req.params.roomId[0]
        : req.params.roomId;

      const data =
        req.body as CreatePeakSeasonInput;

      const rate =
        await tenantPeakSeasonService.createRate(
          tenantId,
          roomId,
          data,
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Peak season rate created successfully",
          serializeBigInt(rate),
        ),
      );
    },
  );

  getRates = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.roomId)
        ? req.params.roomId[0]
        : req.params.roomId;

      const rates =
        await tenantPeakSeasonService.getRates(
          tenantId,
          roomId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Peak season rates retrieved successfully",
          serializeBigInt(rates),
        ),
      );
    },
  );

  getRate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const rateId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const rate =
        await tenantPeakSeasonService.getRate(
          tenantId,
          rateId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Peak season rate retrieved successfully",
          serializeBigInt(rate),
        ),
      );
    },
  );

  updateRate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const rateId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const data =
        req.body as UpdatePeakSeasonInput;

      const rate =
        await tenantPeakSeasonService.updateRate(
          tenantId,
          rateId,
          data,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Peak season rate updated successfully",
          serializeBigInt(rate),
        ),
      );
    },
  );

  deleteRate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const rateId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await tenantPeakSeasonService.deleteRate(
        tenantId,
        rateId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Peak season rate deleted successfully",
          null,
        ),
      );
    },
  );
}

export const tenantPeakSeasonController =
  new TenantPeakSeasonController();