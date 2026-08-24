"use client";

import { useState } from "react";
import axios from "axios";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

type Props = {
  onBack: () => void;
  onSuccess: (username: string, password: string) => void;
};

export default function RegisterForm({ onBack, onSuccess }: Props) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setRegisterError("");
    setRegisterSuccess(false);

    const u = registerUsername.trim();
    const eMail = registerEmail.trim();
    const p = registerPassword.trim();
    const cp = registerConfirmPassword.trim();

    if (!u || u.length < 3) return setRegisterError("Invalid username");
    if (!eMail || !validateEmail(eMail))
      return setRegisterError("Invalid email");
    if (!p || p.length < 6) return setRegisterError("Weak password");
    if (p !== cp) return setRegisterError("Passwords do not match");

    setRegisterLoading(true);

    try {
      await adminRegister(u, eMail, p);

      setRegisterSuccess(true);
      onSuccess(u, p);

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRegisterError(err.response?.data?.detail || "Registration failed");
      } else {
        setRegisterError("Unexpected error");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h3 className="text-lg font-bold">Admin Registration</h3>
        <p className="text-xs text-muted-foreground">Create a new admin account</p>
      </div>

      {/* Username */}
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full pl-10 py-3 rounded-xl bg-card border border-border"
          placeholder="Username"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full pl-10 py-3 rounded-xl bg-card border border-border"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={showPassword ? "text" : "password"}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-card border border-border"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* Confirm */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-card border border-border"
          placeholder="Confirm Password"
          value={registerConfirmPassword}
          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showConfirmPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* ERROR */}
      {registerError && (
        <div className="flex gap-2 text-danger text-xs">
          <AlertCircle className="w-4 h-4" />
          {registerError}
        </div>
      )}

      {/* SUCCESS */}
      {registerSuccess && (
        <div className="text-ok text-xs">
          ✓ Registration successful
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-card"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={registerLoading}
          className="flex-1 py-3 rounded-xl bg-brand-strong"
        >
          {registerLoading ? <Loader2 className="animate-spin" /> : "Register"}
        </button>
      </div>
    </form>
  );
}
