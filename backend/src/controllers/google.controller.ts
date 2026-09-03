import { Request, Response } from "express";

import { asyncHandler } from "../utils/core";
import { googleService } from "../services/google.service";

export class GoogleController {
  startLogin = asyncHandler(async (_req: Request, res: Response) => {
    const authorizationUrl = await googleService.getAuthorizationUrl();

    return res.redirect(authorizationUrl);
  });

  callback = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback#error=${encodeURIComponent(
          "Google authorization code is required",
        )}`,
      );
    }

    try {
      const result = await googleService.handleCallback(code);

      const accessToken = encodeURIComponent(result.accessToken);

      const user = encodeURIComponent(JSON.stringify(result.user));

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback#accessToken=${accessToken}&user=${user}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google login failed";

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback#error=${encodeURIComponent(
          message,
        )}`,
      );
    }
  });
}

export const googleController = new GoogleController();
