import prisma from "../config/prisma";
import { user_role } from "../generated/prisma/enums";
import { RegisterInput } from "../validations/auth.validation";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: RegisterInput & { password: string }) {
    return prisma.users.create({
      data: {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        role: user_role.CUSTOMER,
      },
    });
  }
}

export const authRepository = new AuthRepository();