import bcrypt from "bcrypt";

import { authRepository } from "../repositories/auth.repository";
import { profileRepository } from "../repositories/profile.repository";
import { generateToken, sendVerificationEmail } from "../utils/auth";
import { ApiError } from "../utils/core";
import {
  UpdateEmailInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../validations/profile";
import cloudinary from "../config/cloudinary";

export class ProfileService {
  async getProfile(userId: string) {
    const user = await profileRepository.findUserById(BigInt(userId));

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      isVerified: user.is_verified,
      profilePicture: user.profile_picture,
    };
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await profileRepository.findUserById(BigInt(userId));

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updatedUser = await profileRepository.updateFullName(
      BigInt(userId),
      data.fullName,
    );

    return {
      id: updatedUser.id.toString(),
      fullName: updatedUser.full_name,
      email: updatedUser.email,
      role: updatedUser.role,
      provider: updatedUser.provider,
      isVerified: updatedUser.is_verified,
      profilePicture: updatedUser.profile_picture,
    };
  }

  async updateEmail(userId: string, data: UpdateEmailInput) {
    const currentUser = await profileRepository.findUserById(BigInt(userId));

    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    if (currentUser.provider === "GOOGLE") {
      throw new ApiError(
        403,
        "Email cannot be changed for accounts using Google login",
      );
    }

    if (currentUser.email === data.email) {
      throw new ApiError(400, "New email must be different from current email");
    }

    const existingUser = await profileRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const updatedUser = await profileRepository.updateEmail(
      BigInt(userId),
      data.email,
    );

    await authRepository.invalidateVerificationTokens(BigInt(userId));

    const token = generateToken();

    await authRepository.createEmailVerification(BigInt(userId), token);

    await sendVerificationEmail(updatedUser.email, token);

    return {
      id: updatedUser.id.toString(),
      fullName: updatedUser.full_name,
      email: updatedUser.email,
      role: updatedUser.role,
      provider: updatedUser.provider,
      isVerified: updatedUser.is_verified,
      profilePicture: updatedUser.profile_picture,
    };
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await profileRepository.findUserById(BigInt(userId));

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.password) {
      throw new ApiError(
        400,
        "This account does not have a password. Please use the appropriate authentication method.",
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new ApiError(400, "Current password is incorrect");
    }

    const isSamePassword = await bcrypt.compare(
      data.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new ApiError(
        400,
        "New password must be different from current password",
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await profileRepository.updatePassword(BigInt(userId), hashedPassword);

    return {
      message: "Password changed successfully",
    };
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await profileRepository.findUserById(BigInt(userId));

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property-app/profile-pictures",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(new Error("Failed to upload profile picture"));
          }

          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });

    const updatedUser = await profileRepository.updateProfilePicture(
      BigInt(userId),
      imageUrl,
    );

    return {
      id: updatedUser.id.toString(),
      fullName: updatedUser.full_name,
      email: updatedUser.email,
      role: updatedUser.role,
      provider: updatedUser.provider,
      isVerified: updatedUser.is_verified,
      profilePicture: updatedUser.profile_picture,
    };
  }
}

export const profileService = new ProfileService();
