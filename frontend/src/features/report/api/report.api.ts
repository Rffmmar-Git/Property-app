import { api } from "@/services/api/axios";

import type {
  PropertyReportItem,
  PropertyReportQuery,
  SalesReportItem,
  SalesReportQuery,
  TransactionReportItem,
  TransactionReportQuery,
} from "../types/report.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedReport<T> {
  data: T[];
  pagination: ReportPagination;
}

export const getSalesReport = async (
  query: SalesReportQuery,
): Promise<PaginatedReport<SalesReportItem>> => {
  const response = await api.get<
    ApiEnvelope<PaginatedReport<SalesReportItem>>
  >("/reports/sales", {
    params: query,
  });

  return response.data.data;
};

export const getTransactionReport = async (
  query: TransactionReportQuery,
): Promise<PaginatedReport<TransactionReportItem>> => {
  const response = await api.get<
    ApiEnvelope<PaginatedReport<TransactionReportItem>>
  >("/reports/transactions", {
    params: query,
  });

  return response.data.data;
};

export const getPropertyReport = async (
  query: PropertyReportQuery,
): Promise<PropertyReportItem[]> => {
  const response = await api.get<
    ApiEnvelope<PropertyReportItem[]>
  >("/reports/property", {
    params: query,
  });

  return response.data.data;
};