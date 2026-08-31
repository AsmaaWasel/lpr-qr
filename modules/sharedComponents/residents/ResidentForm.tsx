"use client";

import { useState } from "react";
import { X } from "lucide-react";

type CredentialsFormData = {
  email: string;
  password: string;
};

type Props = {
  residentId: number;
  residentName: string;
  onSubmit: (data: CredentialsFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

export default function CredentialsForm({
  residentId,
  residentName,
  onSubmit,
  onClose,
  loading = false,
}: Props) {
  const [form, setForm] = useState<CredentialsFormData>({
    email: "",
    password: "",
  });

  const handleChange = <K extends keyof CredentialsFormData>(
    key: K,
    value: CredentialsFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email) return;
    if (!password) return;

    await onSubmit({
      email,
      password,
    });
  };

  const inputClassName = `
    w-full
    h-12
    rounded-xl
    border
    border-border
    bg-background
    px-4
    text-base
    font-medium
    text-foreground
    outline-none
    transition
    placeholder:text-muted-foreground
    focus:ring-2
    focus:ring-[#132f49]/10
    focus:border-[#132f49]
    dark:focus:ring-white/10
    dark:focus:border-white/30
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Add Credentials
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Add login credentials for{" "}
              <span className="font-semibold text-foreground">
                {residentName}
              </span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Resident ID: {residentId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-muted
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div
          className="
            mt-7
            flex
            justify-end
            gap-3
            border-t
            border-border
            pt-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              px-6
              py-3
              text-base
              font-semibold
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="
              rounded-xl
              bg-[#132f49]
              px-7
              py-3
              text-base
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save Credentials"}
          </button>
        </div>
      </div>
    </div>
  );
}
