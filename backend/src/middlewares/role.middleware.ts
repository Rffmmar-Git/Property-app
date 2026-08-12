import { Request, Response, NextFunction } from "express";
import { user_role } from "../generated/prisma/enums";
import { ApiError } from "../utils/core/ApiError";

export function authorize(...roles: user_role[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
}