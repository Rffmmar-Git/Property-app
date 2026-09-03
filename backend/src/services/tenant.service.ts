import bcrypt from "bcrypt";

import { tenantRepository } from "../repositories/tenant.repository";
import { authRepository } from "../repositories/auth.repository";

import { ApiError } from "../utils/core";

import {
  generateAccessToken,
  generateToken,
  sendVerificationEmail,
} from "../utils/auth";

import { TenantRegisterInput, LoginInput } from "../validations/auth";

import { UpdateTenantProfileInput } from "../validations/profile";

import cloudinary from "../config/cloudinary";

import { user_role } from "../generated/prisma/enums";

export class TenantService {
  async register(data: TenantRegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const { user } = await tenantRepository.createTenant(data);

    const token = generateToken();

    await authRepository.createEmailVerification(user.id, token);

    await sendVerificationEmail(user.email, token);

    return {
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user || user.role !== user_role.TENANT) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.is_verified) {
      throw new ApiError(403, "Please verify your email before logging in");
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

  async getProfile(userId: string) {
    const tenant = await tenantRepository.findTenantByUserId(BigInt(userId));

    if (!tenant) {
      throw new ApiError(404, "Tenant profile not found");
    }

    return {
      id: tenant.users.id.toString(),
      fullName: tenant.users.full_name,
      email: tenant.users.email,
      role: tenant.users.role,
      isVerified: tenant.users.is_verified,
      companyName: tenant.company_name,
      identityNumber: tenant.identity_number,
      taxNumber: tenant.tax_number,
      bankName: tenant.bank_name,
      bankAccountName: tenant.bank_account_name,
      bankAccountNumber: tenant.bank_account_number,
      identityDocumentUrl: tenant.identity_document_url,
    };
  }

  async updateProfile(userId: string, data: UpdateTenantProfileInput) {
    const tenant = await tenantRepository.findTenantByUserId(BigInt(userId));

    if (!tenant) {
      throw new ApiError(404, "Tenant profile not found");
    }

    const updatedTenant = await tenantRepository.updateTenantProfile(
      BigInt(userId),
      data,
    );

    return {
      id: updatedTenant.users.id.toString(),
      fullName: updatedTenant.users.full_name,
      email: updatedTenant.users.email,
      role: updatedTenant.users.role,
      isVerified: updatedTenant.users.is_verified,
      companyName: updatedTenant.company_name,
      identityNumber: updatedTenant.identity_number,
      taxNumber: updatedTenant.tax_number,
      bankName: updatedTenant.bank_name,
      bankAccountName: updatedTenant.bank_account_name,
      bankAccountNumber: updatedTenant.bank_account_number,
      identityDocumentUrl: updatedTenant.identity_document_url,
    };
  }

  async updateIdentityDocument(userId: string, file: Express.Multer.File) {
    const tenant = await tenantRepository.findTenantByUserId(BigInt(userId));

    if (!tenant) {
      throw new ApiError(404, "Tenant profile not found");
    }

    const documentUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property-app/tenant-documents",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(new Error("Failed to upload identity document"));
          }

          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });

    const updatedTenant = await tenantRepository.updateIdentityDocument(
      BigInt(userId),
      documentUrl,
    );

    return {
      id: updatedTenant.users.id.toString(),
      fullName: updatedTenant.users.full_name,
      email: updatedTenant.users.email,
      role: updatedTenant.users.role,
      isVerified: updatedTenant.users.is_verified,
      companyName: updatedTenant.company_name,
      identityNumber: updatedTenant.identity_number,
      taxNumber: updatedTenant.tax_number,
      bankName: updatedTenant.bank_name,
      bankAccountName: updatedTenant.bank_account_name,
      bankAccountNumber: updatedTenant.bank_account_number,
      identityDocumentUrl: updatedTenant.identity_document_url,
    };
  }
}

export const tenantService = new TenantService();
