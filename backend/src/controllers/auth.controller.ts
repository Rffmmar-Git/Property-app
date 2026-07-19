import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  registerSchema,
} from "../validations/auth.validation";
import {
  loginSchema,
} from "../validations/login.validation";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const user = await authService.register(data);

    return res.status(201).json(
      new ApiResponse(true, "Account created successfully", user)
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const user = await authService.login(data);

    return res.status(200).json(
      new ApiResponse(true, "Login successful", user)
    );
  });
}

export const authController = new AuthController();