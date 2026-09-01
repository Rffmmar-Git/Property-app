import {
  ReportRepository,
} from "../../repositories";

import {
  SalesReportQueryDto,
  TransactionReportQueryDto,
  PropertyReportQueryDto,
} from "../../types/dto";

import { ApiError } from "../../utils";

export class ReportService {
  constructor(
    private readonly reportRepository:
      ReportRepository
  ) {}

  //#region Sales Report

  async getSalesReport(
    tenantId: number,
    query: SalesReportQueryDto
  ) {
    this.validatePropertyId(
      query.propertyId
    );

    await this.validatePropertyOwnership(
      tenantId,
      query.propertyId!
    );

    return this.reportRepository
      .findSalesReport(query);
  }

  //#endregion

  //#region Transaction Report

  async getTransactionReport(
    tenantId: number,
    query: TransactionReportQueryDto
  ) {
    this.validatePropertyId(
      query.propertyId
    );

    await this.validatePropertyOwnership(
      tenantId,
      query.propertyId!
    );

    return this.reportRepository
      .findTransactionReport(query);
  }

  //#endregion

  //#region Property Report

  async getPropertyReport(
    tenantId: number,
    query: PropertyReportQueryDto
  ) {
    this.validatePropertyId(
      query.propertyId
    );

    await this.validatePropertyOwnership(
      tenantId,
      query.propertyId!
    );

    return this.reportRepository
      .findPropertyReport(query);
  }

  //#endregion

  //#region Validation

  private validatePropertyId(
    propertyId?: number
  ): void {
    if (
      propertyId === undefined
    ) {
      throw new ApiError(
        400,
        "Property ID is required."
      );
    }
  }

  private async validatePropertyOwnership(
    tenantId: number,
    propertyId: number
  ): Promise<void> {
    const isOwner =
      await this.reportRepository
        .isPropertyOwnedByTenant(
          propertyId,
          tenantId
        );

    if (!isOwner) {
      throw new ApiError(
        403,
        "You are not authorized to access this property report."
      );
    }
  }

  //#endregion
}

//#region Dependencies

const reportRepository =
  new ReportRepository();

export const reportService =
  new ReportService(
    reportRepository
  );

//#endregion