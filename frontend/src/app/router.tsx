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

import CustomerProfilePage from "../pages/profile/CustomerProfilePage";

import CreateReservationPage from "@/pages/reservation/CreateReservationPage";
import PaymentPage from "../pages/payment/PaymentPage";
import MyReservationsPage from "@/pages/reservation/MyReservationPage";
import ReservationDetailPage from "@/pages/reservation/ReservationDetailPage";
import TenantTransactionPage from "@/pages/payment/TenantTransactionPage";
import ReportPage from "@/pages/report/ReportPage";
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

        <Route path="/properties/:id" element={<PropertyDetailPage />} />

        {/* Customer Profile */}
        <Route path="/profile" element={<CustomerProfilePage />} />

        {/* Customer Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Tenant Auth Routes */}
        <Route path="/tenant/login" element={<TenantLoginPage />} />

        <Route path="/register/tenant" element={<TenantRegisterPage />} />

        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        <Route path="/check-email" element={<CheckEmailPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

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
