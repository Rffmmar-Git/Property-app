import axios from "axios";
import { useState } from "react";
import { Building2, CreditCard, Landmark, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTenantRegister } from "../hooks/useTenantRegister";

export function TenantRegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useTenantRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  const getErrorMessage = () => {
    const error = registerMutation.error;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return "This email is already registered. Please use another email or log in.";
      }

      return (
        error.response?.data?.message ||
        "Unable to create your tenant account. Please try again."
      );
    }

    return "Unable to create your tenant account. Please try again.";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    registerMutation.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        identityNumber: identityNumber.trim(),
        taxNumber: taxNumber.trim(),
        bankName: bankName.trim(),
        bankAccountName: bankAccountName.trim(),
        bankAccountNumber: bankAccountNumber.trim(),
      },
      {
        onSuccess: () => {
          navigate("/check-email", {
            state: {
              email: email.trim(),
            },
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Full Name */}
      <div className="relative mb-3">
        <User
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full Name"
          autoComplete="name"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Email */}
      <div className="relative mb-3">
        <Mail
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          autoComplete="email"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Company Name */}
      <div className="relative mb-3">
        <Building2
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder="Company Name"
          autoComplete="organization"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Identity Number */}
      <div className="relative mb-3">
        <CreditCard
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="identityNumber"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={identityNumber}
          onChange={(event) =>
            setIdentityNumber(event.target.value.replace(/\D/g, ""))
          }
          placeholder="Identity Number"
          autoComplete="off"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Tax Number */}
      <div className="relative mb-3">
        <CreditCard
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="taxNumber"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={taxNumber}
          onChange={(event) =>
            setTaxNumber(event.target.value.replace(/\D/g, ""))
          }
          placeholder="Tax Number"
          autoComplete="off"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Bank Name */}
      <div className="relative mb-3">
        <Landmark
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="bankName"
          type="text"
          value={bankName}
          onChange={(event) => setBankName(event.target.value)}
          placeholder="Bank Name"
          autoComplete="off"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Bank Account Name */}
      <div className="relative mb-3">
        <User
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="bankAccountName"
          type="text"
          value={bankAccountName}
          onChange={(event) => setBankAccountName(event.target.value)}
          placeholder="Bank Account Name"
          autoComplete="off"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Bank Account Number */}
      <div className="relative">
        <CreditCard
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="bankAccountNumber"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={bankAccountNumber}
          onChange={(event) =>
            setBankAccountNumber(event.target.value.replace(/\D/g, ""))
          }
          placeholder="Bank Account Number"
          autoComplete="off"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Error */}
      {registerMutation.isError && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
          {getErrorMessage()}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="mt-4 h-[38px] w-full cursor-pointer rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registerMutation.isPending
          ? "Creating account..."
          : "Create tenant account"}
      </button>

      {/* Customer Registration */}
      <div className="mt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Looking for a place to stay?
        </p>

        <Link
          to="/register"
          className="mt-1 inline-block cursor-pointer font-label-bold text-label-bold text-midnight-indigo hover:underline"
        >
          Register as a Customer
        </Link>
      </div>

      {/* Login */}
      <div className="mt-5 border-t border-outline-variant pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-label-bold text-label-bold text-midnight-indigo hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
