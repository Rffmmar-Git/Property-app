import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (process.env.NODE_ENV !== "production") {
  console.error("========== ERROR ==========");
  console.error(err);
  console.error("===========================");
}

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
};
