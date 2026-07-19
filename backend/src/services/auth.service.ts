import bcrypt from "bcrypt";
import { authRepository } from "../repositories/auth.repository";
import { ApiError } from "../utils/ApiError";
import {
  LoginInput,
} from "../validations/login.validation";
import { RegisterInput } from "../validations/auth.validation";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password ?? ""
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    return {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };
  }
}

export const authService = new AuthService();