"use client";

import { useState } from "react";

type CredentialsFormProps = {
  residentId: number;
  residentName: string;
  onClose: () => void;
  onSubmit: (data: {
    resident_id: number;
    email: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
};

export default function CredentialsForm({
  residentId,
  residentName,
  onClose,
  onSubmit,
  loading,
}: CredentialsFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    await onSubmit({
      resident_id: residentId,
      email: email.trim(),
      password: password.trim(),
    });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground text-xl font-semibold">
            Add Credentials
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          Adding credentials for{" "}
          <span className="text-foreground font-medium">{residentName}</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-foreground font-semibold mb-2"
              style={{ fontSize: "24px" }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="
                w-full
                h-11
                px-4
                rounded-xl
                bg-[#020617]
                border
                border-border
                text-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:border-brand
                transition-colors
              "
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-foreground font-semibold mb-2"
              style={{ fontSize: "24px" }}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="
                  w-full
                  h-11
                  px-4
                  pr-12
                  rounded-xl
                  bg-[#939dc9]
                  border
                  border-border
                  text-foreground
                  placeholder:text-muted-foreground
                  focus:outline-none
                  focus:border-brand
                  transition-colors
                "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  hover:text-foreground
                  transition-colors
                "
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                bg-secondary
                text-foreground
                px-4
                py-2.5
                rounded-xl
                hover:bg-secondary
                transition-colors
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="
                flex-1
              
                text-foreground
                px-4
                py-2.5
                rounded-xl
              
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Adding..." : "Add Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
