import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/home/HomePage";
import PropertyListingPage from "../pages/property/PropertyListingPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TenantRegisterPage from "../pages/auth/TenantRegisterPage";
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Property */}
        <Route
          path="/properties"
          element={<PropertyListingPage />}
        />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/register/tenant"
          element={<TenantRegisterPage />}
        />

        <Route
          path="/check-email"
          element={<CheckEmailPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}