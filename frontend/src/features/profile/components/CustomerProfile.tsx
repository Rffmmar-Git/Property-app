import axios from "axios";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  X,
  Save,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CustomerProfile as CustomerProfileData } from "../api/profile.api";
import { useChangePassword } from "../hooks/useChangePassword";
import { useUpdateEmail } from "../hooks/useUpdateEmail";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUpdateProfilePicture } from "../hooks/useUpdateProfilePicture";

interface CustomerProfileProps {
  profile: CustomerProfileData;
}

type EditMode = "profile" | "password" | null;

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

const PROFILE_PICTURE_MAX_SIZE = 1 * 1024 * 1024;

const PROFILE_PICTURE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const PASSWORD_MIN_LENGTH = 8;

export default function CustomerProfile({ profile }: CustomerProfileProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState<EditMode>(null);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [validationError, setValidationError] = useState("");

  const [profileImageError, setProfileImageError] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();
  const updateProfilePictureMutation = useUpdateProfilePicture();
  const changePasswordMutation = useChangePassword();

  const isGoogleAccount = profile.provider === "GOOGLE";

  const isEditingProfile = editMode === "profile";
  const isChangingPasswordMode = editMode === "password";

  const isSaving =
    updateProfileMutation.isPending || updateEmailMutation.isPending;

  const isUploadingProfilePicture = updateProfilePictureMutation.isPending;

  const isChangingPassword = changePasswordMutation.isPending;

  const handleEditProfile = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setValidationError("");

    updateProfileMutation.reset();
    updateEmailMutation.reset();

    setPasswordError("");
    setPasswordSuccess("");
    changePasswordMutation.reset();

    setEditMode("profile");
  };

  const handleEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordError("");
    setPasswordSuccess("");

    changePasswordMutation.reset();

    setValidationError("");
    updateProfileMutation.reset();
    updateEmailMutation.reset();

    setEditMode("password");
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setValidationError("");

    updateProfileMutation.reset();
    updateEmailMutation.reset();

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordError("");
    setPasswordSuccess("");

    changePasswordMutation.reset();

    setEditMode(null);
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
      setEditMode(null);
      return;
    }

    setValidationError("");

    const updateEmailAfterProfile = () => {
      if (!emailChanged) {
        setEditMode(null);
        return;
      }

      updateEmailMutation.mutate(
        {
          email: trimmedEmail,
        },
        {
          onSuccess: (updatedProfile) => {
            setEditMode(null);

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

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one uppercase letter.",
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError(
        "New password must contain at least one lowercase letter.",
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("New password must contain at least one number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");

          setPasswordSuccess("Password changed successfully.");
        },
        onError: (error) => {
          setPasswordError(
            getErrorMessage(
              error,
              "Unable to change your password. Please try again.",
            ),
          );
        },
      },
    );
  };

  const handleProfilePictureClick = () => {
    if (isUploadingProfilePicture) {
      return;
    }

    setProfilePictureError("");
    updateProfilePictureMutation.reset();
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setProfilePictureError("");
    setProfileImageError(false);

    if (!PROFILE_PICTURE_TYPES.includes(file.type)) {
      setProfilePictureError("Only JPG, JPEG, PNG, and GIF files are allowed.");
      return;
    }

    if (file.size > PROFILE_PICTURE_MAX_SIZE) {
      setProfilePictureError("Profile picture must not exceed 1 MB.");
      return;
    }

    updateProfilePictureMutation.mutate(file, {
      onSuccess: () => {
        setProfileImageError(false);
      },
      onError: (error) => {
        setProfilePictureError(
          getErrorMessage(
            error,
            "Unable to update your profile picture. Please try again.",
          ),
        );
      },
    });
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
        <div className="flex shrink-0 flex-col items-center sm:items-start">
          <div className="relative">
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

            <button
              type="button"
              onClick={handleProfilePictureClick}
              disabled={isUploadingProfilePicture}
              aria-label="Change profile picture"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-midnight-indigo text-white shadow-sm transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={handleProfilePictureClick}
            disabled={isUploadingProfilePicture}
            className="mt-3 cursor-pointer text-xs font-semibold text-midnight-indigo transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingProfilePicture ? "Uploading..." : "Change Photo"}
          </button>

          <p className="mt-1 text-center text-[10px] text-slate-muted sm:text-left">
            JPG, PNG, or GIF · Max 1 MB
          </p>

          {profilePictureError && (
            <p className="mt-2 max-w-40 text-center text-[11px] text-red-600 sm:text-left">
              {profilePictureError}
            </p>
          )}
        </div>

        {/* Profile Information */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {!editMode && (
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

            {/* Actions / Role */}
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
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

                  {!isGoogleAccount && (
                    <button
                      type="button"
                      onClick={handleEditPassword}
                      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-midnight-indigo transition-colors hover:border-midnight-indigo hover:bg-blue-50"
                    >
                      <KeyRound size={13} />
                      Change Password
                    </button>
                  )}
                </>
              )}

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-midnight-indigo">
                <ShieldCheck size={13} />
                {profile.role}
              </span>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditingProfile && (
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

                  {validationError && (
                    <p className="mt-3 text-xs text-red-600">
                      {validationError}
                    </p>
                  )}

                  {mutationError && (
                    <p className="mt-3 text-xs text-red-600">{mutationError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Change Password Form */}
          {isChangingPasswordMode && (
            <div className="mt-1 w-full min-w-0">
              <div className="w-full max-w-[560px]">
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <KeyRound size={16} className="text-midnight-indigo" />

                    <h3 className="text-base font-semibold text-slate-text">
                      Change Password
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-slate-muted">
                    Update your password to keep your account secure.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-xs font-semibold text-slate-text"
                  >
                    Current Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value);
                        setPasswordError("");
                        setPasswordSuccess("");
                        changePasswordMutation.reset();
                      }}
                      disabled={isChangingPassword}
                      autoFocus
                      className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors placeholder:text-slate-400 focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                      placeholder="Enter your current password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((value) => !value)}
                      disabled={isChangingPassword}
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo disabled:cursor-not-allowed"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mt-5">
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-semibold text-slate-text"
                  >
                    New Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setPasswordError("");
                        setPasswordSuccess("");
                        changePasswordMutation.reset();
                      }}
                      disabled={isChangingPassword}
                      className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors placeholder:text-slate-400 focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                      placeholder="Enter your new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      disabled={isChangingPassword}
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo disabled:cursor-not-allowed"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-muted">
                    At least 8 characters with uppercase, lowercase, and a
                    number.
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="mt-5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-slate-text"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setPasswordError("");
                        setPasswordSuccess("");
                        changePasswordMutation.reset();
                      }}
                      disabled={isChangingPassword}
                      className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-text outline-none transition-colors placeholder:text-slate-400 focus:border-midnight-indigo focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                      placeholder="Confirm your new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      disabled={isChangingPassword}
                      aria-label={
                        showConfirmPassword
                          ? "Hide password confirmation"
                          : "Show password confirmation"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-midnight-indigo disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Feedback */}
                {passwordError && (
                  <p className="mt-3 text-xs text-red-600">{passwordError}</p>
                )}

                {passwordSuccess && (
                  <p className="mt-3 text-xs text-emerald-600">
                    {passwordSuccess}
                  </p>
                )}

                {/* Password Actions */}
                <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isChangingPassword}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-text transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={13} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="flex cursor-pointer items-center gap-1.5 rounded-md bg-midnight-indigo px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <KeyRound size={13} />

                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div
            className={
              editMode
                ? "mt-5 border-t border-slate-100 pt-4"
                : "mt-5 border-t border-slate-100 pt-4"
            }
          >
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

          {/* Profile Edit Actions */}
          {isEditingProfile && (
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
