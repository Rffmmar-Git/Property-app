import prisma from "../config/prisma";
import { user_role } from "../generated/prisma/enums";
import { RegisterInput } from "../validations/auth";

const TOKEN_EXPIRATION_MS = 15 * 60 * 1000;

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  async createUser(data: RegisterInput) {
    return prisma.users.create({
      data: {
        full_name: data.fullName,
        email: data.email,
        password: null,
        role: user_role.CUSTOMER,
        is_verified: false,
      },
    });
  }

  async createGoogleUser(
    fullName: string,
    email: string,
    profilePicture?: string,
  ) {
    return prisma.users.create({
      data: {
        full_name: fullName,
        email,
        password: null,
        role: user_role.CUSTOMER,
        provider: "GOOGLE",
        is_verified: true,
        profile_picture: profilePicture,
      },
    });
  }

  async createEmailVerification(userId: bigint, token: string) {
    return prisma.email_verifications.create({
      data: {
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + TOKEN_EXPIRATION_MS),
      },
    });
  }

  async invalidateVerificationTokens(userId: bigint) {
    return prisma.email_verifications.updateMany({
      where: {
        user_id: userId,
        used_at: null,
      },
      data: {
        used_at: new Date(),
      },
    });
  }

  async createPasswordReset(userId: bigint, token: string) {
    return prisma.password_resets.create({
      data: {
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + TOKEN_EXPIRATION_MS),
      },
    });
  }

  async invalidatePasswordResetTokens(userId: bigint) {
    return prisma.password_resets.updateMany({
      where: {
        user_id: userId,
        used_at: null,
      },
      data: {
        used_at: new Date(),
      },
    });
  }

  async findPasswordResetToken(token: string) {
    return prisma.password_resets.findUnique({
      where: { token },
      include: { users: true },
    });
  }

  async resetPassword(userId: bigint, tokenId: bigint, password: string) {
    return prisma.$transaction([
      prisma.users.update({
        where: { id: userId },
        data: { password },
      }),
      prisma.password_resets.update({
        where: { id: tokenId },
        data: { used_at: new Date() },
      }),
    ]);
  }

  async findVerificationToken(token: string) {
    return prisma.email_verifications.findUnique({
      where: { token },
      include: { users: true },
    });
  }

  async verifyUser(userId: bigint, tokenId: bigint, password: string) {
    return prisma.$transaction([
      prisma.users.update({
        where: { id: userId },
        data: {
          password,
          is_verified: true,
        },
      }),
      prisma.email_verifications.update({
        where: { id: tokenId },
        data: {
          used_at: new Date(),
        },
      }),
    ]);
  }

  async verifyEmailOnly(userId: bigint, tokenId: bigint) {
    return prisma.$transaction([
      prisma.users.update({
        where: { id: userId },
        data: {
          is_verified: true,
        },
      }),
      prisma.email_verifications.update({
        where: { id: tokenId },
        data: {
          used_at: new Date(),
        },
      }),
    ]);
  }
}

export const authRepository = new AuthRepository();