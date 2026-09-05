import { Landmark } from "lucide-react";

export function BankTransferInfo() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Landmark size={16} className="text-midnight-indigo" />
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Bank transfer details
        </h2>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Transfer the exact total amount to the property host's bank account,
        then upload your proof of payment below. Bank account details aren't
        returned by the API for this reservation yet — please check your
        booking confirmation or contact the host directly.
      </p>
    </div>
  );
}