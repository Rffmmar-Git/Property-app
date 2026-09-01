import { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { ApiResponse } from "../utils";
import { createReservationSchema } from "../validations/reservation/create-reservation.validation";
import { reservationIdSchema } from "../validations/common/reservation-id.schema";
import { reservationService } from "../services/reservation/reservation.service";

export class ReservationController {
  createReservation = asyncHandler(
    async (req: Request, res: Response) => {
      const dto = createReservationSchema.parse({
        roomId: Number(req.body.roomId),
        checkInDate: new Date(req.body.checkInDate),
        checkOutDate: new Date(req.body.checkOutDate),
        guestCount: Number(req.body.guestCount),
      });

      const userId = Number(req.user!.id);

      const result =
        await reservationService.createReservation(
          userId,
          dto
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          "Reservation created successfully.",
          result
        )
      );
    }
  );

  getReservationById = asyncHandler(
    async (req: Request, res: Response) => {
      const { reservationId } =
        reservationIdSchema.parse({
          reservationId: Number(req.params.id),
        });

      const userId = Number(req.user!.id);

      const result =
        await reservationService.getReservationById(
          userId,
          reservationId
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          result.message,
          result.data
        )
      );
    }
  );

  getMyReservations = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = Number(req.user!.id);

      const result =
        await reservationService.getMyReservations(
          userId
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          result.message,
          result.data
        )
      );
    }
  );

  cancelReservation = asyncHandler(
    async (req: Request, res: Response) => {
      const { reservationId } =
        reservationIdSchema.parse({
          reservationId: Number(req.params.id),
        });

      const userId = Number(req.user!.id);

      const result =
        await reservationService.cancelReservation(
          userId,
          reservationId
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          result.message,
          result.data
        )
      );
    }
  );
}

export const reservationController =
  new ReservationController();