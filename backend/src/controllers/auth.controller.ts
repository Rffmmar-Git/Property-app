import { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { ApiResponse } from "../utils";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth";
import { authService } from "../services/auth.service";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const result = await authService.register(data);

    return res.status(201).json(
      new ApiResponse(
        true,
        "Registration successful. Please check your email to verify your account.",
        result
      )
    );
  });

  resendVerification = asyncHandler(
    async (req: Request, res: Response) => {
      const data = resendVerificationSchema.parse(req.body);

      const result = await authService.resendVerification(data);

      return res.status(200).json(
        new ApiResponse(true, result.message, null)
      );
    }
  );

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const data = verifyEmailSchema.parse(req.body);

    const result = await authService.verifyEmail(
      data.token,
      data.password
    );

    return res.status(200).json(
      new ApiResponse(true, result.message, null)
    );
  });

  forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const data = forgotPasswordSchema.parse(req.body);

      const result = await authService.forgotPassword(data);

      return res.status(200).json(
        new ApiResponse(true, result.message, null)
      );
    }
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const data = resetPasswordSchema.parse(req.body);

      const result = await authService.resetPassword(data);

      return res.status(200).json(
        new ApiResponse(true, result.message, null)
      );
    }
  );

  login = asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);

    return res.status(200).json(
      new ApiResponse(true, "Login successful", result)
    );
  });
}

export const authController = new AuthController();