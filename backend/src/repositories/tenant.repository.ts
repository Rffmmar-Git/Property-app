import prisma from "../config/prisma";
import { user_role } from "../generated/prisma/enums";
import { TenantRegisterInput } from "../validations/auth";
import { UpdateTenantProfileInput } from "../validations/profile";

export class TenantRepository {
  async createTenant(data: TenantRegisterInput) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          full_name: data.fullName,
          email: data.email,
          password: null,
          role: user_role.TENANT,
          is_verified: false,
        },
      });

      const tenantProfile = await tx.tenant_profiles.create({
        data: {
          user_id: user.id,
          company_name: data.companyName,
          identity_number: data.identityNumber,
          tax_number: data.taxNumber,
          bank_name: data.bankName,
          bank_account_name: data.bankAccountName,
          bank_account_number: data.bankAccountNumber,
        },
      });

      return {
        user,
        tenantProfile,
      };
    });
  }

  async findTenantByUserId(userId: bigint) {
    return prisma.tenant_profiles.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        users: true,
      },
    });
  }

  async updateTenantProfile(
    userId: bigint,
    data: UpdateTenantProfileInput,
  ) {
    return prisma.tenant_profiles.update({
      where: {
        user_id: userId,
      },
      data: {
        ...(data.companyName !== undefined && {
          company_name: data.companyName,
        }),
        ...(data.identityNumber !== undefined && {
          identity_number: data.identityNumber,
        }),
        ...(data.taxNumber !== undefined && {
          tax_number: data.taxNumber,
        }),
        ...(data.bankName !== undefined && {
          bank_name: data.bankName,
        }),
        ...(data.bankAccountName !== undefined && {
          bank_account_name: data.bankAccountName,
        }),
        ...(data.bankAccountNumber !== undefined && {
          bank_account_number: data.bankAccountNumber,
        }),
      },
      include: {
        users: true,
      },
    });
  }

  async updateIdentityDocument(
    userId: bigint,
    identityDocumentUrl: string,
  ) {
    return prisma.tenant_profiles.update({
      where: {
        user_id: userId,
      },
      data: {
        identity_document_url: identityDocumentUrl,
      },
      include: {
        users: true,
      },
    });
  }
}

export const tenantRepository = new TenantRepository();