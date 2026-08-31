import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/core";
import { profileService } from "../services/profile.service";
import {
  updateProfileSchema,
  updateEmailSchema,
  changePasswordSchema,
} from "../validations/profile";

export class ProfileController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await profileService.getProfile(userId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Profile retrieved successfully",
          result,
        ),
      );
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = updateProfileSchema.parse(req.body);

    const result = await profileService.updateProfile(
      userId,
      data,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Profile updated successfully",
          result,
        ),
      );
  });

  updateEmail = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = updateEmailSchema.parse(req.body);

    const result = await profileService.updateEmail(
      userId,
      data,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Email updated successfully. Please check your new email to verify your account.",
          result,
        ),
      );
  });

  changePassword = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const data = changePasswordSchema.parse(req.body);

      const result = await profileService.changePassword(
        userId,
        data,
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            result.message,
            null,
          ),
        );
    },
  );

  updateProfilePicture = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;

      if (!req.file) {
        throw new ApiError(
          400,
          "Profile picture is required",
        );
      }

      const result =
        await profileService.updateProfilePicture(
          userId,
          req.file,
        );

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            "Profile picture updated successfully",
            result,
          ),
        );
    },
  );
}

export const profileController =
  new ProfileController();