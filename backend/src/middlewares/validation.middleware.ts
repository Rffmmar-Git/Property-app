import { RequestHandler } from "express";
import { z } from "zod";

import { ApiError } from "../utils/core";

const validate = (
  schema: z.ZodType,
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(
        new ApiError(400, message),
      );
    }

    req.body = result.data;

    next();
  };
};

export default validate;