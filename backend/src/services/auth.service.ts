import bcrypt from "bcrypt";
import { authRepository } from "../repositories/auth.repository";
import { ApiError } from "../utils/core";
import {
  generateAccessToken,
  generateToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/auth";

import {
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../validations/auth";

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

  async resendVerification(data: ResendVerificationInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.is_verified) {
      throw new ApiError(400, "Email is already verified");
    }

    await authRepository.invalidateVerificationTokens(user.id);

    const token = generateToken();

    await authRepository.createEmailVerification(user.id, token);

    await sendVerificationEmail(user.email, token);

    return {
      message: "Verification email has been resent",
    };
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      return {
        message:
          "If the email exists, a reset password link has been sent",
      };
    }

    if (!user.password) {
      throw new ApiError(
        400,
        "This account uses social login and cannot reset password",
      );
    }

    await authRepository.invalidatePasswordResetTokens(user.id);

    const token = generateToken();

    await authRepository.createPasswordReset(user.id, token);

    await sendResetPasswordEmail(user.email, token);

    return {
      message:
        "If the email exists, a reset password link has been sent",
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const reset =
      await authRepository.findPasswordResetToken(data.token);

    if (!reset) {
      throw new ApiError(400, "Invalid reset token");
    }

    if (reset.used_at) {
      throw new ApiError(400, "Reset token already used");
    }

    if (reset.expires_at < new Date()) {
      throw new ApiError(400, "Reset token has expired");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await authRepository.resetPassword(
      reset.user_id,
      reset.id,
      hashedPassword,
    );

    return {
      message: "Password has been reset successfully",
    };
  }

  async verifyEmail(token: string, password?: string) {
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

    if (!verification.users.password) {
      if (!password) {
        throw new ApiError(
          400,
          "Password is required to complete email verification",
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await authRepository.verifyUser(
        verification.user_id,
        verification.id,
        hashedPassword,
      );
    } else {
      await authRepository.verifyEmailOnly(
        verification.user_id,
        verification.id,
      );
    }

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
        "Please verify your email before logging in",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password ?? "",
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