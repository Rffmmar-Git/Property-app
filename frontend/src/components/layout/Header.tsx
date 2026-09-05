import { Bell, Building2, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export function Header() {
  // Ambil dan parsing token dari localStorage (Zustand persist store)
  const rawAuth = localStorage.getItem("property-app-auth");
  let token = "";

  if (rawAuth) {
    try {
      const parsedAuth = JSON.parse(rawAuth);
      token = parsedAuth.state?.accessToken || "";
    } catch (e) {
      token = "";
    }
  }

  const navItems = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Explore Properties",
      to: "/properties",
    },
    {
      label: "My Reservations",
      to: "/my-reservations",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-midnight-indigo"
        >
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
          {token ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative rounded-full p-2 text-midnight-indigo transition-colors hover:bg-slate-100"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 p-1.5 text-midnight-indigo transition-colors hover:bg-slate-100"
                title="Profile"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-midnight-indigo/10">
                  <User className="h-4 w-4" />
                </div>
              </Link>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
}