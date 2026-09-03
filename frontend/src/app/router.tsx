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

        {/* Google OAuth */}
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Email Verification */}
        <Route path="/check-email" element={<CheckEmailPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
