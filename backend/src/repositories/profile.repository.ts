import prisma from "../config/prisma";

export class ProfileRepository {
  async findUserById(userId: bigint) {
    return prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async updateFullName(userId: bigint, fullName: string) {
    return prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        full_name: fullName,
      },
    });
  }

  async updateEmail(userId: bigint, email: string) {
    return prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        email,
        is_verified: false,
      },
    });
  }

  async updateProfilePicture(userId: bigint, profilePicture: string) {
    return prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        profile_picture: profilePicture,
      },
    });
  }

  async updatePassword(userId: bigint, password: string) {
    return prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
