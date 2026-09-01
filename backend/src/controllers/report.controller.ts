import { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { ApiResponse } from "../utils";
import { ApiError } from "../utils";
import { reportService } from "../services/report/report.service";
import {
  transactionReportQuerySchema,
} from "../validations/report/transaction-report-query.validation";
import {
  salesReportQuerySchema,
} from "../validations/report/sales-report-query.validation";

import {
  propertyReportQuerySchema,
} from "../validations/report/property-report-query.validation";

export class ReportController {
  //#region Sales Report

  getSalesReport = asyncHandler(
    async (req: Request, res: Response) => {
      /**
       * Temporary.
       * Will be replaced with req.user.id
       * after Authentication Middleware
       * is completed.
       */
      const tenantId =
        Number(req.user!.id);

      if (
        Number.isNaN(tenantId) ||
        tenantId <= 0
      ) {
        throw new ApiError(
          400,
          "Tenant ID is required."
        );
      }

      const query =
        salesReportQuerySchema.parse({
            page: req.query.page
            ? Number(req.query.page)
            : undefined,

            limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,

            propertyId:
            req.query.propertyId
                ? Number(req.query.propertyId)
                : undefined,

            startDate:
            req.query.startDate
                ? new Date(
                    String(req.query.startDate)
                )
                : undefined,

            endDate:
            req.query.endDate
                ? new Date(
                    String(req.query.endDate)
                )
                : undefined,

            sortBy:
            req.query.sortBy
                ? String(req.query.sortBy)
                : undefined,

            order:
            req.query.order
                ? String(req.query.order)
                : undefined,
        });

      const result =
        await reportService
          .getSalesReport(
            tenantId,
            query
          );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Sales report retrieved successfully.",
          result
        )
      );
    }
  );

  //#endregion

  //#region Transaction Report

  getTransactionReport = asyncHandler(
    async (req: Request, res: Response) => {
      /**
       * Temporary.
       * Will be replaced with req.user.id
       * after Authentication Middleware
       * is completed.
       */
      const tenantId =
        Number(req.user!.id);

      if (
        Number.isNaN(tenantId) ||
        tenantId <= 0
      ) {
        throw new ApiError(
          400,
          "Tenant ID is required."
        );
      }

      const query =
        transactionReportQuerySchema.parse({
            page: req.query.page
            ? Number(req.query.page)
            : undefined,

            limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,

            propertyId:
            req.query.propertyId
                ? Number(req.query.propertyId)
                : undefined,

            startDate:
            req.query.startDate
                ? new Date(
                    String(req.query.startDate)
                )
                : undefined,

            endDate:
            req.query.endDate
                ? new Date(
                    String(req.query.endDate)
                )
                : undefined,

            sortBy:
            req.query.sortBy
                ? String(req.query.sortBy)
                : undefined,

            order:
            req.query.order
                ? String(req.query.order)
                : undefined,
        });
      const result =
        await reportService
          .getTransactionReport(
            tenantId,
            query
          );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Transaction report retrieved successfully.",
          result
        )
      );
    }
  );

  //#endregion

  //#region Property Report

  getPropertyReport = asyncHandler(
    async (req: Request, res: Response) => {
      /**
       * Temporary.
       * Will be replaced with req.user.id
       * after Authentication Middleware
       * is completed.
       */
      const tenantId =
        Number(req.user!.id);

      if (
        Number.isNaN(tenantId) ||
        tenantId <= 0
      ) {
        throw new ApiError(
          400,
          "Tenant ID is required."
        );
      }

      const query =
        propertyReportQuerySchema.parse({
          propertyId:
            req.query.propertyId
              ? Number(
                  req.query.propertyId
                )
              : undefined,

          month:
            req.query.month
              ? Number(
                  req.query.month
                )
              : undefined,

          year:
            req.query.year
              ? Number(
                  req.query.year
                )
              : undefined,
        });

      const result =
        await reportService
          .getPropertyReport(
            tenantId,
            query
          );

      return res.status(200).json(
        new ApiResponse(
          true,
          "Property report retrieved successfully.",
          result
        )
      );
    }
  );

  //#endregion
}

export const reportController =
  new ReportController();