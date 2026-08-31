import { Request, Response } from "express";

import { tenantRoomAvailabilityService } from "../services/tenant-room-availability.service";

import { CreateRoomAvailabilityInput } from "../validations/room";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class TenantRoomAvailabilityController {
  closeDate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.roomId)
        ? req.params.roomId[0]
        : req.params.roomId;

      const data =
        req.body as CreateRoomAvailabilityInput;

      const availability =
        await tenantRoomAvailabilityService.closeDate(
          tenantId,
          roomId,
          data,
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Room date closed successfully",
          serializeBigInt(availability),
        ),
      );
    },
  );

  getClosedDates = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.roomId)
        ? req.params.roomId[0]
        : req.params.roomId;

      const dates =
        await tenantRoomAvailabilityService.getClosedDates(
          tenantId,
          roomId,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Room closed dates retrieved successfully",
          serializeBigInt(dates),
        ),
      );
    },
  );

  openDate = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const availabilityId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;

      await tenantRoomAvailabilityService.openDate(
        tenantId,
        availabilityId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Room date opened successfully",
          null,
        ),
      );
    },
  );
}

export const tenantRoomAvailabilityController =
  new TenantRoomAvailabilityController();