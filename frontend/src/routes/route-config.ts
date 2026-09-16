import type { ComponentType } from "react";

import HomePage from "@/pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TenantRegisterPage from "../pages/auth/TenantRegisterPage";
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

import CreateReservationPage from "@/pages/reservation/CreateReservationPage";
import PropertyDetailPage from "@/pages/property/PropertyDetailPage";
import PaymentPage from "@/pages/payment/PaymentPage";
import MyReservationsPage from "@/pages/reservation/MyReservationPage";
import ReservationDetailPage from "@/pages/reservation/ReservationDetailPage";

import TenantProfilePage from "@/pages/profile/TenantProfilePage";
import TenantDashboardPage from "@/pages/home/TenantDashboardPage";
import TenantTransactionPage from "@/pages/payment/TenantTransactionPage";
import ReportPage from "@/pages/report/ReportPage";

import UnauthorizedPage from "@/pages/error/UnauthorizedPage";
import ReviewPage from "@/pages/review/ReviewPage";

export const user_role = {
  CUSTOMER: "CUSTOMER",
  TENANT: "TENANT",
} as const;

export type UserRole = (typeof user_role)[keyof typeof user_role];

export interface AppRoute {
  path: string;
  Component: ComponentType;
  isProtected?: boolean;
  allowedRoles?: UserRole[];
}

export const ROUTES = {
  HOME: "/",
  UNAUTHORIZED: "/unauthorized",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_TENANT: "/register/tenant",
  CHECK_EMAIL: "/check-email",
  VERIFY_EMAIL: "/verify-email",

  PROPERTY_DETAIL: "/properties/:id",

  CREATE_RESERVATION: "/reservations/create/:id",
  PAYMENT_PAGE: "/payments/:reservationId",
  MY_RESERVATIONS: "/my-reservations",
  RESERVATION_DETAIL: "/reservations/:id",
  REVIEW_CUSTOMER: "/reviews/:reservationId",

  TENANT_DASHBOARD: "/tenant/dashboard",
  TENANT_PROFILE: "/tenant/profile",
  TENANT_TRANSACTION: "/tenant/transactions",
  TENANT_REPORT: "/tenant/reports",
} as const;

export const routeConfig: AppRoute[] = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
  },
  {
    path: ROUTES.UNAUTHORIZED,
    Component: UnauthorizedPage,
  },
  {
    path: ROUTES.LOGIN,
    Component: LoginPage,
  },
  {
    path: ROUTES.REGISTER,
    Component: RegisterPage,
  },
  {
    path: ROUTES.REGISTER_TENANT,
    Component: TenantRegisterPage,
  },
  {
    path: ROUTES.CHECK_EMAIL,
    Component: CheckEmailPage,
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    Component: VerifyEmailPage,
  },
  {
    path: ROUTES.PROPERTY_DETAIL,
    Component: PropertyDetailPage,
  },
  {
    path: ROUTES.CREATE_RESERVATION,
    Component: CreateReservationPage,
    isProtected: true,
    allowedRoles: [user_role.CUSTOMER],
  },
  {
    path: ROUTES.PAYMENT_PAGE,
    Component: PaymentPage,
    isProtected: true,
    allowedRoles: [user_role.CUSTOMER],
  },
  {
    path: ROUTES.MY_RESERVATIONS,
    Component: MyReservationsPage,
    isProtected: true,
    allowedRoles: [user_role.CUSTOMER],
  },
  {
    path: ROUTES.RESERVATION_DETAIL,
    Component: ReservationDetailPage,
    isProtected: true,
    allowedRoles: [user_role.CUSTOMER],
  },
  {
    path: ROUTES.TENANT_PROFILE,
    Component: TenantProfilePage,
    isProtected: true,
    allowedRoles: [user_role.TENANT],
  },
  {
    path: ROUTES.REVIEW_CUSTOMER,
    Component: ReviewPage,
    isProtected: true,
    allowedRoles: [user_role.CUSTOMER],
  },
  {
    path: ROUTES.TENANT_DASHBOARD,
    Component: TenantDashboardPage,
    isProtected: true,
    allowedRoles: [user_role.TENANT],
  },
  {
    path: ROUTES.TENANT_TRANSACTION,
    Component: TenantTransactionPage,
    isProtected: true,
    allowedRoles: [user_role.TENANT],
  },
  {
    path: ROUTES.TENANT_REPORT,
    Component: ReportPage,
    isProtected: true,
    allowedRoles: [user_role.TENANT],
  },
];