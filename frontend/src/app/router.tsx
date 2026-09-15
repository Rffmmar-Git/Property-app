import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/home/HomePage";
import PropertyListingPage from "../pages/property/PropertyListingPage";
import PropertyDetailPage from "../pages/property/PropertyDetailPage";

import LoginPage from "../pages/auth/LoginPage";
import TenantLoginPage from "../pages/auth/TenantLoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TenantRegisterPage from "../pages/auth/TenantRegisterPage";
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import GoogleCallbackPage from "../pages/auth/GoogleCallbackPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import CustomerProfilePage from "../pages/profile/CustomerProfilePage";
import TenantProfilePage from "../pages/profile/TenantProfilePage";

import UnauthorizedPage from "../pages/error/UnauthorizedPage";

import TenantDashboardPage from "../pages/tenant/TenantDashboardPage";
import PropertyCategoryPage from "../pages/tenant/PropertyCategoryPage";
import TenantPropertyPage from "../pages/tenant/TenantPropertyPage";

import CreateReservationPage from "@/pages/reservation/CreateReservationPage";
import PaymentPage from "../pages/payment/PaymentPage";
import MyReservationsPage from "@/pages/reservation/MyReservationPage";
import ReservationDetailPage from "@/pages/reservation/ReservationDetailPage";

import TenantTransactionPage from "@/pages/payment/TenantTransactionPage";
import ReportPage from "@/pages/report/ReportPage";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { user_role } from "@/routes/route-config";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer / Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Property */}
        <Route path="/properties" element={<PropertyListingPage />} />

        <Route
          path="/properties/:id"
          element={<PropertyDetailPage />}
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        {/* Customer Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[user_role.CUSTOMER]}>
                <CustomerProfilePage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Tenant Profile */}
        <Route
          path="/tenant/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[user_role.TENANT]}>
                <TenantProfilePage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Customer Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route path="/register" element={<RegisterPage />} />

        {/* Tenant Auth Routes */}
        <Route
          path="/tenant/login"
          element={<TenantLoginPage />}
        />

        <Route
          path="/register/tenant"
          element={<TenantRegisterPage />}
        />

        <Route
          path="/auth/google/callback"
          element={<GoogleCallbackPage />}
        />

        <Route path="/check-email" element={<CheckEmailPage />} />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        {/* Tenant Portal */}
        <Route
          path="/tenant/dashboard"
          element={
            <RoleRoute allowedRoles={[user_role.TENANT]}>
              <TenantDashboardPage />
            </RoleRoute>
          }
        />

        <Route
          path="/tenant/categories"
          element={
            <RoleRoute allowedRoles={[user_role.TENANT]}>
              <PropertyCategoryPage />
            </RoleRoute>
          }
        />

        <Route
          path="/tenant/properties"
          element={
            <RoleRoute allowedRoles={[user_role.TENANT]}>
              <TenantPropertyPage />
            </RoleRoute>
          }
        />

        {/* Customer Reservation Routes */}
        <Route
          path="/reservations/create/:id"
          element={
            <RoleRoute allowedRoles={[user_role.CUSTOMER]}>
              <CreateReservationPage />
            </RoleRoute>
          }
        />

        <Route
          path="/payments/:reservationId"
          element={
            <RoleRoute allowedRoles={[user_role.CUSTOMER]}>
              <PaymentPage />
            </RoleRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <RoleRoute allowedRoles={[user_role.CUSTOMER]}>
              <MyReservationsPage />
            </RoleRoute>
          }
        />

        <Route
          path="/reservations/:id"
          element={
            <RoleRoute allowedRoles={[user_role.CUSTOMER]}>
              <ReservationDetailPage />
            </RoleRoute>
          }
        />

        {/* Tenant Feature 2 Routes */}
        <Route
          path="/tenant/transactions"
          element={
            <RoleRoute allowedRoles={[user_role.TENANT]}>
              <TenantTransactionPage />
            </RoleRoute>
          }
        />

        <Route
          path="/tenant/reports"
          element={
            <RoleRoute allowedRoles={[user_role.TENANT]}>
              <ReportPage />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}