import { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { ApiResponse } from "../utils";
import { ApiError } from "../utils";
import {
  uploadPaymentSchema,
} from "../validations/payment/upload-payment.validation";

import {
  confirmPaymentSchema,
} from "../validations/payment/confirm-payment.validation";

import {
  rejectPaymentSchema,
} from "../validations/payment/reject-payment.validation";

import { paymentService } from "../services/payment/payment.service";

export class PaymentController {
  //#region User Payment

  uploadPaymentProof = asyncHandler(
    async (req: Request, res: Response) => {
      const dto =
        uploadPaymentSchema.parse({
          reservationId:
            Number(req.body.reservationId),
        });

      if (!req.file) {
        throw new ApiError(
          400,
          "Payment proof image is required."
        );
      }

      const userId =
        Number(req.user!.id);

      const result =
        await paymentService
          .uploadPaymentProof(
            userId,
            dto,
            req.file
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

  //#endregion

  //#region Tenant Payment

  confirmPayment = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId =
        Number(req.user!.id);

      const { reservationId } =
        confirmPaymentSchema.parse({
          reservationId:
            Number(req.params.id),
        });

      const result =
        await paymentService
          .confirmPayment(
            tenantId,
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

  rejectPayment = asyncHandler(
    async (req: Request, res: Response) => {
      const tenantId =
        Number(req.user!.id);

      const { reservationId } =
        rejectPaymentSchema.parse({
          reservationId:
            Number(req.params.id),
        });

      const result =
        await paymentService
          .rejectPayment(
            tenantId,
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

  //#endregion
}

export const paymentController =
  new PaymentController();