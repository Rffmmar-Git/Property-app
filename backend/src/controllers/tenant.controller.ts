import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/core";
import {
  tenantRegisterSchema,
} from "../validations/auth";
import {
  updateTenantProfileSchema,
} from "../validations/profile";
import { tenantService } from "../services/tenant.service";

export class TenantController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data = tenantRegisterSchema.parse(req.body);

    const result = await tenantService.register(data);

    return res.status(201).json(
      new ApiResponse(
        true,
        "Tenant registration successful. Please check your email to verify your account.",
        result,
      ),
    );
  });

  getProfile = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await tenantService.getProfile(
        req.user!.id,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant profile retrieved successfully",
          result,
        ),
      );
    },
  );

  updateProfile = asyncHandler(
    async (req: Request, res: Response) => {
      const data = updateTenantProfileSchema.parse(
        req.body,
      );

      const result = await tenantService.updateProfile(
        req.user!.id,
        data,
      );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Tenant profile updated successfully",
          result,
        ),
      );
    },
  );

  updateIdentityDocument = asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.file) {
        throw new ApiError(
          400,
          "Identity document is required",
        );
      }

      const result =
        await tenantService.updateIdentityDocument(
          req.user!.id,
          req.file,
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Identity document uploaded successfully",
          result,
        ),
      );
    },
  );
}

export const tenantController =
  new TenantController();