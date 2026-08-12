import prisma from "../config/prisma";
import { user_role } from "../generated/prisma/enums";
import { RegisterInput } from "../validations/auth";

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

  async createEmailVerification(userId: bigint, token: string) {
    return prisma.email_verifications.create({
      data: {
        user_id: userId,
        token,
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
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
}

export const authRepository = new AuthRepository();