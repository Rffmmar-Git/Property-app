import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface BankDetails {
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
}

interface BankTransferInfoProps {
  bankDetails: BankDetails | null;
}

export function BankTransferInfo({
  bankDetails,
}: BankTransferInfoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAccountNumber = async () => {
    if (!bankDetails?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(
        bankDetails.accountNumber
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy account number:", error);
    }
  };

  if (!bankDetails) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Bank Details
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Bank account information is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        Bank Details
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-slate-500">
            Bank
          </p>

          <p className="font-medium text-slate-900">
            {bankDetails.bankName ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Account Name
          </p>

          <p className="font-medium text-slate-900">
            {bankDetails.accountName ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Account Number
          </p>

          <div className="mt-1 flex items-center gap-2">
            <p className="font-semibold tracking-wide text-slate-900">
              {bankDetails.accountNumber ?? "-"}
            </p>

            {bankDetails.accountNumber && (
              <button
                type="button"
                onClick={handleCopyAccountNumber}
                className="inline-flex items-center gap-1 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Copy bank account number"
                title="Copy account number"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Copied
                    </span>
                  </>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
