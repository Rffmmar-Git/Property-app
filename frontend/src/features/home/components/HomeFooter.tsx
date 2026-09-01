import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-7">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-midnight-indigo"
            >
              <Building2 size={16} strokeWidth={2.5} />

              <span className="text-[11px] font-bold">
                Property App
              </span>
            </Link>

            <p className="mt-3 max-w-[180px] text-[8px] leading-4 text-slate-muted">
              Finding your perfect stay has never been
              easier. Premium properties, seamless
              booking.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[9px] font-semibold text-slate-text">
              Company
            </h3>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="#"
                className="text-[8px] text-slate-muted hover:text-midnight-indigo"
              >
                About Us
              </Link>

              <Link
                to="#"
                className="text-[8px] text-slate-muted hover:text-midnight-indigo"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[9px] font-semibold text-slate-text">
              Support
            </h3>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="#"
                className="text-[8px] text-slate-muted hover:text-midnight-indigo"
              >
                Customer Support
              </Link>

              <Link
                to="#"
                className="text-[8px] text-slate-muted hover:text-midnight-indigo"
              >
                Tenant Resources
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[9px] font-semibold text-slate-text">
              Legal
            </h3>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="#"
                className="text-[8px] text-slate-muted hover:text-midnight-indigo"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-[8px] text-slate-muted">
            © 2024 Property App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}