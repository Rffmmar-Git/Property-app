import axios from "axios";
import { CheckCircle2, Mail, Pencil, ShieldCheck, X, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CustomerProfile as CustomerProfileData } from "../api/profile.api";
import { useUpdateEmail } from "../hooks/useUpdateEmail";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

interface CustomerProfileProps {
  profile: CustomerProfileData;
}

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

export default function CustomerProfile({ profile }: CustomerProfileProps) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [validationError, setValidationError] = useState("");
  const [profileImageError, setProfileImageError] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();

  const isGoogleAccount = profile.provider === "GOOGLE";

  const isSaving =
    updateProfileMutation.isPending || updateEmailMutation.isPending;

  const handleEdit = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setValidationError("");

    updateProfileMutation.reset();
    updateEmailMutation.reset();

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setValidationError("");

    updateProfileMutation.reset();
    updateEmailMutation.reset();

    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedFullName = fullName.trim();

    if (trimmedFullName.length < 2) {
      setValidationError("Full name must be at least 2 characters.");
      return;
    }

    if (trimmedFullName.length > 100) {
      setValidationError("Full name must not exceed 100 characters.");
      return;
    }

    const nameChanged = trimmedFullName !== profile.fullName;

    let emailChanged = false;
    let trimmedEmail = profile.email;

    if (!isGoogleAccount) {
      trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setValidationError("Email is required.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setValidationError("Please enter a valid email address.");
        return;
      }

      emailChanged = trimmedEmail.toLowerCase() !== profile.email.toLowerCase();
    }

    if (!nameChanged && !emailChanged) {
      setIsEditing(false);
      return;
    }

    setValidationError("");

    const updateEmailAfterProfile = () => {
      if (!emailChanged) {
        setIsEditing(false);
        return;
      }

      updateEmailMutation.mutate(
        {
          email: trimmedEmail,
        },
        {
          onSuccess: (updatedProfile) => {
            setIsEditing(false);

            navigate("/check-email", {
              state: {
                email: updatedProfile.email,
              },
            });
          },
        },
      );
    };

    if (nameChanged) {
      updateProfileMutation.mutate(
        {
          fullName: trimmedFullName,
        },
        {
          onSuccess: updateEmailAfterProfile,
        },
      );

      return;
    }

    updateEmailAfterProfile();
  };

  const showProfileImage =
    Boolean(profile.profilePicture) && !profileImageError;

  const mutationError = updateEmailMutation.isError
    ? getErrorMessage(
        updateEmailMutation.error,
        "Unable to update your email. Please try again.",
      )
    : updateProfileMutation.isError
      ? getErrorMessage(
          updateProfileMutation.error,
          "Unable to update your profile. Please try again.",
        )
      : "";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Profile Picture */}
        <div className="flex shrink-0 justify-center sm:justify-start">
          {showProfileImage ? (
            <img
              src={profile.profilePicture ?? ""}
              alt={profile.fullName}
              onError={() => setProfileImageError(true)}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-50"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-semibold text-midnight-indigo ring-4 ring-blue-50">
              {getInitials(profile.fullName)}
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {!isEditing && (
                <>
                  <h2 className="text-xl font-semibold text-slate-text">
                    {profile.fullName}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-muted">
                    <Mail size={14} />
                    <span className="break-all">{profile.email}</span>
                  </div>
                </>
              )}
            </div>

            {/* Role / Edit Action */}
            <div className="flex shrink-0 items-center gap-3">
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-midnight-indigo transition-colors hover:border-midnight-indigo hover:bg-blue-50"
                >
                  <Pencil size={13} />
                  Edit Profile
                </button>
              )}

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-midnight-indigo">
                <ShieldCheck size={13} />
                {profile.role}
              </span>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-1 w-full min-w-0">
              <div className="w-full max-w-[560px]">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-slate-text"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      setValidationError("");
                      updateProfileMutation.reset();
                      updateEmailMutation.reset();
                    }}
                    disabled={isSaving}
                    autoFocus
                    className="mt-2 block h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-text outline-none transition-colors placeholder:text-slate-400 focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="mt-5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-text"
                  >
                    Email
                  </label>

                  {isGoogleAccount ? (
                    <>
                      <div className="mt-2 flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-muted">
                        <Mail size={15} />
                        <span className="break-all">{profile.email}</span>
                      </div>

                      <p className="mt-1.5 text-[11px] text-slate-muted">
                        This email is managed by your Google account and cannot
                        be changed here.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted"
                        />

                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setValidationError("");
                            updateProfileMutation.reset();
                            updateEmailMutation.reset();
                          }}
                          disabled={isSaving}
                          className="mt-2 block h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-text outline-none transition-colors placeholder:text-slate-400 focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <p className="mt-1.5 text-[11px] text-slate-muted">
                        Changing your email will require you to verify the new
                        email address again.
                      </p>
                    </>
                  )}
                </div>

                {/* Validation / Backend Error */}
                {validationError && (
                  <p className="mt-3 text-xs text-red-600">{validationError}</p>
                )}

                {mutationError && (
                  <p className="mt-3 text-xs text-red-600">{mutationError}</p>
                )}
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className={
                  profile.isVerified ? "text-emerald-600" : "text-slate-400"
                }
              />

              <span className="text-sm font-medium text-slate-text">
                {profile.isVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-text transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={13} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !fullName.trim()}
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-midnight-indigo px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={13} />

                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
