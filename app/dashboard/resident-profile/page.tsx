"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Mail, Lock, UserRound } from "lucide-react";

import { useAuth } from "@/shared/context/AuthContext";
import { useToast } from "@/shared/hooks/use-toast";
import { changeResidentPassword } from "@/services/resident";

type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function ResidentProfilePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<PasswordErrors>({});
  const [changingPassword, setChangingPassword] = useState(false);

  const username = user?.username || "Resident";

  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "RE";

  // =========================
  // VALIDATION
  // =========================

  const validatePasswordForm = (): boolean => {
    const newErrors: PasswordErrors = {};

    // Current password
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    } else if (newPassword === currentPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async () => {
    // Validate before API request
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setChangingPassword(true);

      await changeResidentPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully");

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear errors
      setErrors({});
    } catch (error: any) {
      console.error("Change password error:", error);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Failed to change password");
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to change password",
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================
  // INPUT CHANGE HELPERS
  // =========================

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);

    if (errors.currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: undefined,
      }));
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    setErrors((prev) => ({
      ...prev,
      newPassword: undefined,
      confirmPassword:
        prev.confirmPassword && value !== confirmPassword
          ? "Passwords do not match"
          : undefined,
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: undefined,
      }));
    }
  };

  // =========================
  // INPUT STYLE
  // =========================

  const inputClassName = `
    h-12
    w-full
    rounded-xl
    border
    border-border
    bg-background
    px-4
    pr-11
    text-base
    font-medium
    text-foreground
    outline-none
    transition
    placeholder:text-muted-foreground
    focus:border-[#132f49]
    focus:ring-2
    focus:ring-[#132f49]/10
  `;

  const errorInputClassName = `
    border-red-500
    focus:border-red-500
    focus:ring-red-500/10
  `;

  return (
    <div className="space-y-5">
      {/* ================= PROFILE ================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm
        "
      >
        {/* COVER */}

        <div
          className="
            h-32
            bg-gradient-to-r
            from-[#16324F]
            to-[#0B1B30]
          "
        />

        <div className="px-6 pb-7 md:px-8">
          {/* AVATAR */}

          <div className="-mt-12 mb-5">
            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-2xl
                border-4
                border-card
                bg-[#132f49]
                text-2xl
                font-bold
                text-white
                shadow-lg
              "
            >
              {initials}
            </div>
          </div>

          {/* NAME */}

          <h2 className="text-2xl font-bold text-foreground">{username}</h2>

          <p className="mt-1 text-sm font-medium text-[#7C93B4]">Resident</p>

          {/* INFO */}

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* NAME */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-brand/10
                    text-brand
                  "
                >
                  <UserRound size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Name
                  </p>

                  <p className="mt-1 text-base font-semibold text-foreground">
                    {user?.username || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* EMAIL */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-brand/10
                    text-brand
                  "
                >
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 truncate text-base font-semibold text-foreground">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}

      <div
        className="
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-sm
          md:p-7
        "
      >
        {/* HEADER */}

        <div className="mb-6 flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-brand/10
              text-brand
            "
          >
            <KeyRound size={20} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">
              Change Password
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your account password
            </p>
          </div>
        </div>

        {/* FORM */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CURRENT PASSWORD */}

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-semibold text-foreground">
              Current Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => handleCurrentPasswordChange(e.target.value)}
                placeholder="Enter current password"
                className={`
                  ${inputClassName}
                  pl-11
                  ${errors.currentPassword ? errorInputClassName : ""}
                `}
                disabled={changingPassword}
              />

              <button
                type="button"
                disabled={changingPassword}
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  transition
                  hover:text-foreground
                "
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-xs font-medium text-red-500">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">
              New Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                placeholder="Enter new password"
                className={`
                  ${inputClassName}
                  pl-11
                  ${errors.newPassword ? errorInputClassName : ""}
                `}
                disabled={changingPassword}
              />

              <button
                type="button"
                disabled={changingPassword}
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  transition
                  hover:text-foreground
                "
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs font-medium text-red-500">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">
              Confirm New Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Confirm new password"
                className={`
                  ${inputClassName}
                  pl-11
                  ${errors.confirmPassword ? errorInputClassName : ""}
                `}
                disabled={changingPassword}
              />

              <button
                type="button"
                disabled={changingPassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  transition
                  hover:text-foreground
                "
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-xs font-medium text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* PASSWORD RULES */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-border
            bg-background
            p-4
          "
        >
          <p className="mb-2 text-xs font-semibold text-foreground">
            Password requirements:
          </p>

          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• At least 8 characters</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
          </ul>
        </div>

        {/* BUTTON */}

        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#132f49]
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <KeyRound size={17} />

            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
