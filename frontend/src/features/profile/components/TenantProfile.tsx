import axios from "axios";
import {
  Building2,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  KeyRound,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  TenantProfile as TenantProfileData,
  UpdateTenantProfilePayload,
} from "../api/tenant-profile.api";
import { useChangePassword } from "../hooks/useChangePassword";
import { useUpdateEmail } from "../hooks/useUpdateEmail";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUpdateProfilePicture } from "../hooks/useUpdateProfilePicture";
import { useUpdateTenantIdentityDocument } from "../hooks/useUpdateTenantIdentityDocument";
import { useUpdateTenantProfile } from "../hooks/useUpdateTenantProfile";

interface TenantProfileProps {
  profile: TenantProfileData;
}

type EditMode = "profile" | "password" | null;

const MAX_PROFILE_PICTURE_SIZE = 1 * 1024 * 1024;

const ALLOWED_PROFILE_PICTURE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  if (Array.isArray(responseData?.detail)) {
    const message = responseData.detail
      .map((item: { message?: string }) => item.message)
      .filter(Boolean)
      .join(" ");

    if (message) {
      return message;
    }
  }

  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }

  return fallbackMessage;
};

const getDisplayValue = (value: string | null) => {
  return value?.trim() ? value : "Not provided";
};

const getInitials = (fullName: string) => {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "T"
  );
};

const isStrongPassword = (password: string) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
};

export default function TenantProfile({ profile }: TenantProfileProps) {
  const navigate = useNavigate();
  const profilePictureInputRef = useRef<HTMLInputElement | null>(null);

  const [editMode, setEditMode] = useState<EditMode>(null);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);

  const [companyName, setCompanyName] = useState(profile.companyName ?? "");
  const [identityNumber, setIdentityNumber] = useState(
    profile.identityNumber ?? "",
  );
  const [taxNumber, setTaxNumber] = useState(profile.taxNumber ?? "");
  const [bankName, setBankName] = useState(profile.bankName ?? "");
  const [bankAccountName, setBankAccountName] = useState(
    profile.bankAccountName ?? "",
  );
  const [bankAccountNumber, setBankAccountNumber] = useState(
    profile.bankAccountNumber ?? "",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedIdentityDocument, setSelectedIdentityDocument] =
    useState<File | null>(null);
  const [identityDocumentError, setIdentityDocumentError] = useState("");

  const [validationError, setValidationError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");

  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();
  const changePasswordMutation = useChangePassword();
  const updateProfilePictureMutation = useUpdateProfilePicture();

  const updateTenantProfileMutation = useUpdateTenantProfile();
  const updateTenantIdentityDocumentMutation =
    useUpdateTenantIdentityDocument();

  const isEditingProfile = editMode === "profile";
  const isChangingPassword = editMode === "password";

  const isSavingProfile =
    updateProfileMutation.isPending ||
    updateEmailMutation.isPending ||
    updateTenantProfileMutation.isPending;

  const isChangingPasswordPending = changePasswordMutation.isPending;
  const isUploadingProfilePicture = updateProfilePictureMutation.isPending;
  const isUploadingIdentityDocument =
    updateTenantIdentityDocumentMutation.isPending;

  const resetTenantFields = () => {
    setCompanyName(profile.companyName ?? "");
    setIdentityNumber(profile.identityNumber ?? "");
    setTaxNumber(profile.taxNumber ?? "");
    setBankName(profile.bankName ?? "");
    setBankAccountName(profile.bankAccountName ?? "");
    setBankAccountNumber(profile.bankAccountNumber ?? "");
  };

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    changePasswordMutation.reset();
  };

  const handleEditProfile = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    resetTenantFields();

    setValidationError("");
    setProfilePictureError("");
    updateProfileMutation.reset();
    updateEmailMutation.reset();
    updateTenantProfileMutation.reset();

    setEditMode("profile");
  };

  const handleChangePasswordMode = () => {
    setValidationError("");
    setPasswordError("");
    changePasswordMutation.reset();
    setEditMode("password");
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    resetTenantFields();
    resetPasswordFields();

    setValidationError("");
    setProfilePictureError("");
    updateProfileMutation.reset();
    updateEmailMutation.reset();
    updateTenantProfileMutation.reset();

    setEditMode(null);
  };

  const handleSaveProfile = () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const trimmedCompanyName = companyName.trim();
    const trimmedIdentityNumber = identityNumber.trim();
    const trimmedTaxNumber = taxNumber.trim();
    const trimmedBankName = bankName.trim();
    const trimmedBankAccountName = bankAccountName.trim();
    const trimmedBankAccountNumber = bankAccountNumber.trim();

    if (!trimmedFullName) {
      setValidationError("Full name is required.");
      return;
    }

    if (trimmedFullName.length < 2) {
      setValidationError("Full name must be at least 2 characters.");
      return;
    }

    if (trimmedFullName.length > 100) {
      setValidationError("Full name must not exceed 100 characters.");
      return;
    }

    if (!trimmedEmail) {
      setValidationError("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (trimmedCompanyName && trimmedCompanyName.length < 2) {
      setValidationError("Company name must be at least 2 characters.");
      return;
    }

    if (trimmedCompanyName.length > 150) {
      setValidationError("Company name must not exceed 150 characters.");
      return;
    }

    if (trimmedIdentityNumber.length > 50) {
      setValidationError("Identity number must not exceed 50 characters.");
      return;
    }

    if (trimmedTaxNumber.length > 50) {
      setValidationError("Tax number must not exceed 50 characters.");
      return;
    }

    if (trimmedBankName.length > 100) {
      setValidationError("Bank name must not exceed 100 characters.");
      return;
    }

    if (trimmedBankAccountName.length > 100) {
      setValidationError(
        "Bank account name must not exceed 100 characters.",
      );
      return;
    }

    if (trimmedBankAccountNumber.length > 50) {
      setValidationError(
        "Bank account number must not exceed 50 characters.",
      );
      return;
    }

    const tenantPayload: UpdateTenantProfilePayload = {
      companyName: trimmedCompanyName,
      identityNumber: trimmedIdentityNumber,
      taxNumber: trimmedTaxNumber,
      bankName: trimmedBankName,
      bankAccountName: trimmedBankAccountName,
      bankAccountNumber: trimmedBankAccountNumber,
    };

    setValidationError("");

    const saveTenantProfile = () => {
      updateTenantProfileMutation.mutate(tenantPayload, {
        onSuccess: () => {
          setEditMode(null);
        },
      });
    };

    const saveEmail = () => {
      if (trimmedEmail === profile.email.toLowerCase()) {
        saveTenantProfile();
        return;
      }

      updateEmailMutation.mutate(
        { email: trimmedEmail },
        {
          onSuccess: (updatedProfile) => {
            setEmail(updatedProfile.email);

            navigate("/check-email", {
              state: {
                email: updatedProfile.email,
              },
            });
          },
        },
      );
    };

    if (trimmedFullName !== profile.fullName) {
      updateProfileMutation.mutate(
        { fullName: trimmedFullName },
        {
          onSuccess: () => {
            saveEmail();
          },
        },
      );
      return;
    }

    saveEmail();
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordError(
        "New password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    setPasswordError("");

    changePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          resetPasswordFields();
          setEditMode(null);
        },
      },
    );
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setProfilePictureError("");
    updateProfilePictureMutation.reset();

    if (!file) {
      return;
    }

    if (!ALLOWED_PROFILE_PICTURE_TYPES.includes(file.type)) {
      setProfilePictureError(
        "Only JPG, JPEG, PNG, and GIF images are allowed.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_PICTURE_SIZE) {
      setProfilePictureError("Profile picture size must not exceed 1 MB.");
      event.target.value = "";
      return;
    }

    updateProfilePictureMutation.mutate(file, {
      onSuccess: () => {
        event.target.value = "";
      },
    });
  };

  const handleIdentityDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setIdentityDocumentError("");
    updateTenantIdentityDocumentMutation.reset();

    if (!file) {
      setSelectedIdentityDocument(null);
      return;
    }

    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedFileTypes.includes(file.type)) {
      setSelectedIdentityDocument(null);
      setIdentityDocumentError(
        "Only PDF, JPG, JPEG, and PNG files are allowed.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      setSelectedIdentityDocument(null);
      setIdentityDocumentError("File size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedIdentityDocument(file);
  };

  const handleUploadIdentityDocument = () => {
    if (!selectedIdentityDocument) {
      setIdentityDocumentError("Please select an identity document first.");
      return;
    }

    setIdentityDocumentError("");

    updateTenantIdentityDocumentMutation.mutate(selectedIdentityDocument, {
      onSuccess: () => {
        setSelectedIdentityDocument(null);
      },
    });
  };

  const profileMutationError = updateProfileMutation.isError
    ? getErrorMessage(
        updateProfileMutation.error,
        "Unable to update your personal information. Please try again.",
      )
    : "";

  const emailMutationError = updateEmailMutation.isError
    ? getErrorMessage(
        updateEmailMutation.error,
        "Unable to update your email address. Please try again.",
      )
    : "";

  const tenantMutationError = updateTenantProfileMutation.isError
    ? getErrorMessage(
        updateTenantProfileMutation.error,
        "Unable to update your tenant profile. Please try again.",
      )
    : "";

  const passwordMutationError = changePasswordMutation.isError
    ? getErrorMessage(
        changePasswordMutation.error,
        "Unable to change your password. Please try again.",
      )
    : "";

  const profilePictureMutationError = updateProfilePictureMutation.isError
    ? getErrorMessage(
        updateProfilePictureMutation.error,
        "Unable to update your profile picture. Please try again.",
      )
    : "";

  const identityDocumentMutationError =
    updateTenantIdentityDocumentMutation.isError
      ? getErrorMessage(
          updateTenantIdentityDocumentMutation.error,
          "Unable to upload your identity document. Please try again.",
        )
      : "";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative shrink-0">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.fullName} profile`}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-50"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-midnight-indigo text-xl font-bold text-white ring-4 ring-blue-50">
                  {getInitials(profile.fullName)}
                </div>
              )}

              <button
                type="button"
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={isUploadingProfilePicture}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-midnight-indigo text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Change profile picture"
              >
                <Camera size={14} />
              </button>

              <input
                ref={profilePictureInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                onChange={handleProfilePictureChange}
                disabled={isUploadingProfilePicture}
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="shrink-0 text-midnight-indigo" />

                <h2 className="truncate text-xl font-semibold text-slate-text">
                  {profile.fullName}
                </h2>
              </div>

              <p className="mt-1 break-words text-sm text-slate-muted">
                {profile.email}
              </p>

              {profilePictureError && (
                <p className="mt-2 text-xs text-red-600">
                  {profilePictureError}
                </p>
              )}

              {profilePictureMutationError && (
                <p className="mt-2 text-xs text-red-600">
                  {profilePictureMutationError}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!editMode && (
              <>
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-midnight-indigo transition-colors hover:border-midnight-indigo hover:bg-blue-50"
                >
                  <Pencil size={13} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={handleChangePasswordMode}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-midnight-indigo transition-colors hover:border-midnight-indigo hover:bg-blue-50"
                >
                  <KeyRound size={13} />
                  Change Password
                </button>
              </>
            )}

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-midnight-indigo">
              <ShieldCheck size={13} />
              {profile.role}
            </span>
          </div>
        </div>

        {isChangingPassword ? (
          <div className="border-t border-slate-100 pt-5">
            <div className="mb-5 flex items-center gap-2">
              <KeyRound size={18} className="text-midnight-indigo" />

              <h3 className="text-sm font-semibold text-slate-text">
                Change Password
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="tenantCurrentPassword"
                  className="block text-xs font-semibold text-slate-text"
                >
                  Current Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="tenantCurrentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setPasswordError("");
                      changePasswordMutation.reset();
                    }}
                    disabled={isChangingPasswordPending}
                    className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="tenantNewPassword"
                  className="block text-xs font-semibold text-slate-text"
                >
                  New Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="tenantNewPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setPasswordError("");
                      changePasswordMutation.reset();
                    }}
                    disabled={isChangingPasswordPending}
                    className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="tenantConfirmPassword"
                  className="block text-xs font-semibold text-slate-text"
                >
                  Confirm New Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="tenantConfirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setPasswordError("");
                      changePasswordMutation.reset();
                    }}
                    disabled={isChangingPasswordPending}
                    className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-muted">
              Password must contain at least 8 characters, one uppercase
              letter, one lowercase letter, and one number.
            </p>

            {(passwordError || passwordMutationError) && (
              <div className="mt-4">
                {passwordError && (
                  <p className="text-xs text-red-600">{passwordError}</p>
                )}

                {passwordMutationError && (
                  <p className="mt-2 text-xs text-red-600">
                    {passwordMutationError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isChangingPasswordPending}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-text transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={13} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPasswordPending}
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-midnight-indigo px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={13} />

                {isChangingPasswordPending
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </div>
          </div>
        ) : isEditingProfile ? (
          <div className="grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="tenantFullName"
                className="block text-xs font-semibold text-slate-text"
              >
                Full Name
              </label>

              <input
                id="tenantFullName"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setValidationError("");
                  updateProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label
                htmlFor="tenantEmail"
                className="block text-xs font-semibold text-slate-text"
              >
                Email Address
              </label>

              <input
                id="tenantEmail"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setValidationError("");
                  updateEmailMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter email address"
              />

              <p className="mt-1 text-[11px] text-slate-muted">
                Changing your email requires verification through the new
                email address.
              </p>
            </div>

            <div>
              <label
                htmlFor="tenantCompanyName"
                className="block text-xs font-semibold text-slate-text"
              >
                Company Name
              </label>

              <input
                id="tenantCompanyName"
                type="text"
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label
                htmlFor="tenantIdentityNumber"
                className="block text-xs font-semibold text-slate-text"
              >
                Identity Number
              </label>

              <input
                id="tenantIdentityNumber"
                type="text"
                value={identityNumber}
                onChange={(event) => {
                  setIdentityNumber(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter identity number"
              />
            </div>

            <div>
              <label
                htmlFor="tenantTaxNumber"
                className="block text-xs font-semibold text-slate-text"
              >
                Tax Number
              </label>

              <input
                id="tenantTaxNumber"
                type="text"
                value={taxNumber}
                onChange={(event) => {
                  setTaxNumber(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter tax number"
              />
            </div>

            <div>
              <label
                htmlFor="tenantBankName"
                className="block text-xs font-semibold text-slate-text"
              >
                Bank Name
              </label>

              <input
                id="tenantBankName"
                type="text"
                value={bankName}
                onChange={(event) => {
                  setBankName(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter bank name"
              />
            </div>

            <div>
              <label
                htmlFor="tenantBankAccountName"
                className="block text-xs font-semibold text-slate-text"
              >
                Bank Account Name
              </label>

              <input
                id="tenantBankAccountName"
                type="text"
                value={bankAccountName}
                onChange={(event) => {
                  setBankAccountName(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter bank account name"
              />
            </div>

            <div>
              <label
                htmlFor="tenantBankAccountNumber"
                className="block text-xs font-semibold text-slate-text"
              >
                Bank Account Number
              </label>

              <input
                id="tenantBankAccountNumber"
                type="text"
                value={bankAccountNumber}
                onChange={(event) => {
                  setBankAccountNumber(event.target.value);
                  setValidationError("");
                  updateTenantProfileMutation.reset();
                }}
                disabled={isSavingProfile}
                className="mt-2 block h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                placeholder="Enter bank account number"
              />
            </div>

            {(validationError ||
              profileMutationError ||
              emailMutationError ||
              tenantMutationError) && (
              <div className="md:col-span-2">
                {validationError && (
                  <p className="text-xs text-red-600">{validationError}</p>
                )}

                {profileMutationError && (
                  <p className="mt-2 text-xs text-red-600">
                    {profileMutationError}
                  </p>
                )}

                {emailMutationError && (
                  <p className="mt-2 text-xs text-red-600">
                    {emailMutationError}
                  </p>
                )}

                {tenantMutationError && (
                  <p className="mt-2 text-xs text-red-600">
                    {tenantMutationError}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 md:col-span-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSavingProfile}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-text transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={13} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-midnight-indigo px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={13} />

                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Full Name
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {profile.fullName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">Email</p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Company Name
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.companyName)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Identity Number
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.identityNumber)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Tax Number
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.taxNumber)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Bank Name
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.bankName)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Bank Account Name
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.bankAccountName)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-muted">
                Bank Account Number
              </p>

              <p className="mt-1 break-words text-sm text-slate-text">
                {getDisplayValue(profile.bankAccountNumber)}
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-midnight-indigo" />

                <p className="text-xs font-semibold text-slate-muted">
                  Identity Document
                </p>
              </div>

              {profile.identityDocumentUrl ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="text-sm text-emerald-700">
                    Identity document uploaded
                  </p>

                  <a
                    href={profile.identityDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-midnight-indigo hover:underline"
                  >
                    View Document
                    <ExternalLink size={13} />
                  </a>
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-text">Not uploaded</p>
              )}

              <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <label
                      htmlFor="tenantIdentityDocument"
                      className="block text-xs font-semibold text-slate-text"
                    >
                      {profile.identityDocumentUrl
                        ? "Replace Identity Document"
                        : "Upload Identity Document"}
                    </label>

                    <p className="mt-1 text-xs text-slate-muted">
                      PDF, JPG, JPEG, or PNG. Maximum 5 MB.
                    </p>

                    <input
                      id="tenantIdentityDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={handleIdentityDocumentChange}
                      disabled={isUploadingIdentityDocument}
                      className="mt-3 block w-full text-xs text-slate-text file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-midnight-indigo file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    {selectedIdentityDocument && (
                      <p className="mt-2 break-words text-xs text-slate-muted">
                        Selected: {selectedIdentityDocument.name}
                      </p>
                    )}

                    {identityDocumentError && (
                      <p className="mt-2 text-xs text-red-600">
                        {identityDocumentError}
                      </p>
                    )}

                    {identityDocumentMutationError && (
                      <p className="mt-2 text-xs text-red-600">
                        {identityDocumentMutationError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadIdentityDocument}
                    disabled={
                      !selectedIdentityDocument || isUploadingIdentityDocument
                    }
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-midnight-indigo px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={14} />

                    {isUploadingIdentityDocument
                      ? "Uploading..."
                      : "Upload Document"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
          <CheckCircle2
            size={16}
            className={
              profile.isVerified ? "text-emerald-600" : "text-slate-400"
            }
          />

          <span className="text-sm font-medium text-slate-text">
            {profile.isVerified ? "Email verified" : "Email not verified"}
          </span>

          {!profile.isVerified && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-muted">
              <Mail size={13} />
              Verification required
            </span>
          )}
        </div>
      </div>
    </section>
  );
}