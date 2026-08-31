import { Request, Response } from "express";

import { tenantRoomService } from "../services/tenant-room.service";

import {
  CreateRoomInput,
  UpdateRoomInput,
} from "../validations/room";

import {
  ApiResponse,
  asyncHandler,
  serializeBigInt,
} from "../utils/core";

export class TenantRoomController {
  createRoom = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const propertyId = Array.isArray(req.params.propertyId)
        ? req.params.propertyId[0]
        : req.params.propertyId;

      const data = req.body as CreateRoomInput;

      const room = await tenantRoomService.createRoom(
        tenantId,
        propertyId,
        data,
      );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Room created successfully",
          serializeBigInt(room),
        ),
      );
    },
  );

  getMyRooms = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const rooms =
        await tenantRoomService.getMyRooms(tenantId);

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant rooms retrieved successfully",
          serializeBigInt(rooms),
        ),
      );
    },
  );

  getMyRoom = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const room = await tenantRoomService.getMyRoom(
        tenantId,
        roomId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant room retrieved successfully",
          serializeBigInt(room),
        ),
      );
    },
  );

  updateRoom = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const data = req.body as UpdateRoomInput;

      const room = await tenantRoomService.updateRoom(
        tenantId,
        roomId,
        data,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Room updated successfully",
          serializeBigInt(room),
        ),
      );
    },
  );

  deleteRoom = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId = BigInt(req.user!.id);

      const roomId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await tenantRoomService.deleteRoom(
        tenantId,
        roomId,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Room deleted successfully",
          null,
        ),
      );
    },
  );
}

export const tenantRoomController =
  new TenantRoomController();