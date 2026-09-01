import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TenantRegisterPage from "../pages/auth/TenantRegisterPage";
import CheckEmailPage from "../pages/auth/CheckEmailPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
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

        {/* Home */}
        <Route
          path="/"
          element={
            <div className="p-8 text-center font-bold">
              Welcome to Property App!
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}