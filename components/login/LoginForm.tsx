"use client";

import { useState } from "react";
import {
  Lock,
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Mail,
} from "lucide-react";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  gateStatus?: "idle" | "opening" | "error";
};

export default function LoginForm({
  onSubmit,
  isLoading = false,
  error = "",
  gateStatus = "idle",
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedEmail) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return;
    }

    if (!trimmedPassword) {
      return;
    }

    if (trimmedPassword.length < 6) {
      return;
    }

    await onSubmit(trimmedEmail, trimmedPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Email */}
      <div className="space-y-3">
        <label className="ml-1 block text-2xl font-semibold uppercase tracking-widest text-slate-400">
          Email Address
        </label>

        <div className="group relative">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500 transition-colors group-focus-within:text-sky-400" />

          <input
            type="email"
            placeholder="name@domain.com"
            className="w-full rounded-xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-xl text-white placeholder:text-xl placeholder:text-slate-300 outline-none transition-all focus:border-sky-400/40 focus:bg-white/10 focus:ring-4 focus:ring-sky-400/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-3">
        <label className="ml-1 block text-2xl font-semibold uppercase tracking-widest text-slate-400">
          Password
        </label>

        <div className="group relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500 transition-colors group-focus-within:text-sky-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/5 bg-white/5 py-4 pl-12 pr-14 text-xl text-white placeholder:text-2xl placeholder:text-slate-200 outline-none transition-all focus:border-sky-400/40 focus:bg-white/10 focus:ring-4 focus:ring-sky-400/5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me / Forgot Password */}
      <div className="flex items-center justify-between px-1">
        <label className="flex cursor-pointer items-center gap-2 text-2xl text-slate-400 transition-colors hover:text-slate-200">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-5 w-5 rounded border-white/10 bg-white/5 accent-sky-500"
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={() => {}}
          className="text-2xl font-medium text-sky-400/80 transition-colors hover:text-sky-400"
        >
          Forgot Password?
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-2xl text-red-400 animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading || gateStatus === "opening"}
        className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl py-5 text-base font-bold uppercase tracking-widest text-white transition-all active:scale-[0.98] disabled:opacity-70 ${
          gateStatus === "opening"
            ? "bg-emerald-600"
            : gateStatus === "error"
              ? "bg-red-600"
              : "bg-sky-600 hover:bg-sky-500"
        }`}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <>
            <LogIn className="h-6 w-6" />

            <span>
              {gateStatus === "opening"
                ? "Access Granted"
                : gateStatus === "error"
                  ? "Access Denied"
                  : "Login"}
            </span>
          </>
        )}
      </button>
    </form>
  );
}
