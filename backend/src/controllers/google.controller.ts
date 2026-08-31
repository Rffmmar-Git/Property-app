import { Request, Response } from "express";
import { asyncHandler } from "../utils/core";
import { googleService } from "../services/google.service";

export class GoogleController {
  startLogin = asyncHandler(
    async (_req: Request, res: Response) => {
      const authorizationUrl =
        await googleService.getAuthorizationUrl();

      return res.redirect(authorizationUrl);
    },
  );

  callback = asyncHandler(
    async (req: Request, res: Response) => {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        return res.status(400).json({
          success: false,
          message: "Google authorization code is required",
        });
      }

      const result =
        await googleService.handleCallback(code);

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        data: result,
      });
    },
  );
}

export const googleController =
  new GoogleController();