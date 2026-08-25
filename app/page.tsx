"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";
import { ArrowLeft } from "lucide-react";

import RegisterForm from "@/modules/sharedComponents/auth/RegisterForm";
import LoginForm from "@/modules/resident-portal/components/LoginForm";
import GateAnimation from "@/modules/resident-portal/components/GateAnimation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [gateStatus, setGateStatus] = useState<"idle" | "opening" | "error">(
    "idle",
  );

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setGateStatus("idle");
    setLoading(true);

    try {
      const result = await login(email, password);
      setGateStatus("opening");
      setLoading(false);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get user role from localStorage
      const userRole = localStorage.getItem("userRole");

      // Check if user is admin based on role
      const isAdmin = userRole === "admin" || userRole === "superAdmin";

      if (isAdmin) {
        router.push("/dashboard/qr/qr");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
      setGateStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleRegisterSuccess = (username: string, password: string) => {
    setShowRegister(false);
    // يمكن تمرير البيانات إلى LoginForm إذا أردت
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050a18] px-4">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a18]/80 via-[#0a1128]/40 to-[#050a18]" />
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-12 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50" />

        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <GateAnimation gateStatus={gateStatus} />

          <div className="p-6 border-b border-border flex items-center">
            <div className="text-center">
              <img
                src="/logo.svg"
                alt="company logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Forms */}
        {!showRegister ? (
          <>
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loading}
              error={error}
              gateStatus={gateStatus}
            />

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowRegister(true);
                  setError("");
                }}
                className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-brand transition-colors"
              >
                Don&apos;t have an account? Create new admin
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <RegisterForm
              onBack={() => {
                setShowRegister(false);
                setError("");
              }}
              onSuccess={handleRegisterSuccess}
            />

            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-brand transition-colors mx-auto block"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
