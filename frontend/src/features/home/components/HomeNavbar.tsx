import { Building2, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../stores/auth.store";

const getInitials = (fullName: string) => {
  const names = fullName.trim().split(/\s+/).filter(Boolean);

  if (names.length === 0) {
    return "?";
  }

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
};

export default function HomeNavbar() {
  const navigate = useNavigate();

  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const navItems = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Explore Properties",
      to: "/properties",
    },
    ...(user?.role === "TENANT"
      ? [
          {
            label: "Tenant Portal",
            to: "/tenant/dashboard",
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-midnight-indigo">
          <Building2 size={19} strokeWidth={2.5} />

          <span className="font-headline-md text-[16px] font-bold">
            Property App
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-midnight-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-sunrise-amber"
                    : "text-slate-muted hover:text-midnight-indigo"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated || !user ? (
            <>
              <Link
                to="/login"
                className="text-[11px] font-medium text-midnight-indigo transition-colors hover:text-blue-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-midnight-indigo px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Profile Avatar */}
              <Link
                to="/profile"
                aria-label="Open profile"
                title="Profile"
                className="flex cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-midnight-indigo ring-2 ring-slate-100">
                    {getInitials(user.fullName)}
                  </div>
                )}
              </Link>

              <span
                className="hidden max-w-[140px] truncate text-[11px] font-medium text-slate-text sm:block"
                title={user.fullName}
              >
                Hi, {user.fullName}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-midnight-indigo transition-colors hover:text-blue-800"
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
