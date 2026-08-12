import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { user_role } from "../../generated/prisma/enums";

export interface JwtPayload {
  userId: string;
  role: user_role;
}

export function generateAccessToken(
  payload: JwtPayload
): string {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const options: SignOptions = {
    expiresIn: (env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAccessToken(
  token: string
): JwtPayload {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as JwtPayload;
}