import {
  ReportRepository,
} from "../../repositories";

import {
  SalesReportQueryDto,
  TransactionReportQueryDto,
  PropertyReportQueryDto,
} from "../../types/dto";

import { ReportMapperService } from "./report-mapper.service";

export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly mapperService: ReportMapperService
  ) {}

  //#region Sales Report

  async getSalesReport(
    tenantId: number,
    query: SalesReportQueryDto
  ) {
    const result =
      await this.reportRepository
        .findSalesReport(
          tenantId,
          query
        );

    return this.mapperService
      .buildSalesReportResponse(
        result.reservations,
        result.total,
        query.page ?? 1,
        query.limit ?? 10
      );
  }

  //#endregion

  //#region Transaction Report

  async getTransactionReport(
    tenantId: number,
    query: TransactionReportQueryDto
  ) {
    const result =
      await this.reportRepository
        .findTransactionReport(
          tenantId,
          query
        );

    return this.mapperService
      .buildTransactionReportResponse(
        result.reservations,
        result.total,
        query.page ?? 1,
        query.limit ?? 10
      );
  }

  //#endregion

  //#region Property Report

  async getPropertyReport(
    tenantId: number,
    query: PropertyReportQueryDto
  ) {
    const result =
      await this.reportRepository
        .findPropertyReport(
          tenantId,
          query
        );

    return this.mapperService
      .buildPropertyReportResponse(
        result
      );
  }

  //#endregion
}

//#region Dependencies

const reportRepository =
  new ReportRepository();

const reportMapperService =
  new ReportMapperService();

export const reportService =
  new ReportService(
    reportRepository,
    reportMapperService
  );

//#endregion