import bcrypt from "bcrypt";
import { authRepository } from "../repositories/auth.repository";
import { ApiError } from "../utils/core";
import { generateAccessToken } from "../utils/auth";
import { generateToken } from "../utils/auth";
import { sendVerificationEmail } from "../utils/auth";
import { LoginInput, RegisterInput } from "../validations/auth";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await authRepository.createUser(data);

    const token = generateToken();

    await authRepository.createEmailVerification(user.id, token);

    await sendVerificationEmail(user.email, token);

    return {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      isVerified: user.is_verified,
    };
  }

  async verifyEmail(token: string, password: string) {
    const verification =
      await authRepository.findVerificationToken(token);

    if (!verification) {
      throw new ApiError(400, "Invalid verification token");
    }

    if (verification.used_at) {
      throw new ApiError(400, "Verification token already used");
    }

    if (verification.expires_at < new Date()) {
      throw new ApiError(400, "Verification token has expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await authRepository.verifyUser(
      verification.user_id,
      verification.id,
      hashedPassword
    );

    return {
      message: "Email verified successfully. Please login.",
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.is_verified) {
      throw new ApiError(
        403,
        "Please verify your email before logging in"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password ?? ""
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken({
      userId: user.id.toString(),
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id.toString(),
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();