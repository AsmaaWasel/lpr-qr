"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/context/AuthContext";

import { ArrowLeft, KeyRound, ShieldCheck, Video } from "lucide-react";

import GateAnimation from "@/components/login/GateAnimation";
import LoginForm from "@/components/login/LoginForm";

/* =========================================================
   FEATURES
========================================================= */

const PANEL_FEATURES = [
  {
    icon: Video,
    label: "Live camera monitoring across every gate",
  },
  {
    icon: KeyRound,
    label: "Issue and revoke resident QR credentials",
  },
  {
    icon: ShieldCheck,
    label: "Role-based access for admins and residents",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [gateStatus, setGateStatus] = useState<"idle" | "opening" | "error">(
    "idle",
  );

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setGateStatus("idle");
    setLoading(true);

    try {
      await login(email, password);

      setGateStatus("opening");
      setLoading(false);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userRole = localStorage.getItem("role");

      if (userRole === "superAdmin" || userRole === "admin") {
        router.push("/dashboard");
      } else if (userRole === "resident") {
        router.push("/dashboard/qr-resident/qr-generator");
      }
    } catch (err) {
      console.error("Login Error:", err);

      setLoading(false);
      setGateStatus("error");

      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="flex min-h-screen bg-[#F2F6FB] dark:bg-[#050a18]">
      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}

      <aside
        className="
          relative
          hidden
          overflow-hidden
          bg-[#0B2239]
          lg:flex
          lg:w-[46%]
          xl:w-[52%]
        "
      >
        {/* Background image */}

        <div
          aria-hidden
          className="
            absolute
            inset-0
            scale-105
            bg-cover
            bg-center
            bg-no-repeat
            opacity-[0.22]
          "
          style={{
            backgroundImage: "url('/background.png')",
          }}
        />

        {/* Dark overlay */}

        <div
          aria-hidden
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#0B2239]
            via-[#0B2239]/85
            to-[#06121f]
          "
        />

        {/* Grid */}

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Cyan glow */}

        <div
          aria-hidden
          className="
            absolute
            -left-24
            top-1/4
            h-80
            w-80
            rounded-full
            bg-[#29C5E8]/20
            blur-[120px]
          "
        />

        {/* Blue glow */}

        <div
          aria-hidden
          className="
            absolute
            -right-20
            bottom-8
            h-72
            w-72
            rounded-full
            bg-[#3B5473]/50
            blur-[110px]
          "
        />

        {/* Panel content */}

        <div
          className="
            relative
            z-10
            flex
            w-full
            flex-col
            justify-between
            p-10
            xl:p-14
          "
        >
          {/* Logo */}

          <img
            src="/logo.svg"
            alt="Company logo"
            className="
              h-10
              w-auto
              self-start
              object-contain
            "
          />

          {/* Main content */}

          <div className="max-w-md">
            <div
              className="
                mb-4
                inline-flex
                items-center
                rounded-full
                border
                border-[#29C5E8]/20
                bg-[#29C5E8]/10
                px-3
                py-1
                text-xs
                font-semibold
                text-[#29C5E8]
              "
            >
              Access Management System
            </div>

            <h2
              className="
                text-4xl
                font-bold
                leading-[1.1]
                text-white
                xl:text-5xl
              "
            >
              Compound Gates fully managed from one dashboard
            </h2>

            {/* Features */}

            <ul className="mt-7 space-y-3">
              {PANEL_FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#29C5E8]/25
                        bg-[#29C5E8]/10
                      "
                  >
                    <Icon
                      className="
                          h-[18px]
                          w-[18px]
                          text-[#29C5E8]
                        "
                    />
                  </span>

                  <span
                    className="
                        text-[14px]
                        font-medium
                        text-[#C4D5E8]
                      "
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright */}

          <p className="text-xs text-[#5E7896]">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </aside>

      {/* =====================================================
          FORM COLUMN
      ===================================================== */}

      <section
        className="
          flex
          min-h-screen
          w-full
          flex-1
          items-center
          justify-center
          px-5
          py-6
          sm:px-8
          lg:py-8
        "
      >
        <div className="w-full max-w-[580px]">
          {/* Mobile logo */}

          <div className="mb-5 flex justify-center lg:hidden">
            <img
              src="/logo.svg"
              alt="Company logo"
              className="
                h-10
                w-auto
                object-contain
              "
            />
          </div>

          {/* =================================================
              FORM CARD
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              px-7
              py-5
              shadow-[0_12px_40px_-18px_rgba(59,84,115,0.45)]
              sm:px-8
              sm:py-6
              dark:shadow-[0_12px_40px_-18px_rgba(0,0,0,0.7)]
            "
          >
            {/* Gate animation */}

            <div className="flex justify-center">
              <GateAnimation gateStatus={gateStatus} />
            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mt-4">
              <h1
                className="
                  text-[24px]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-[#3B5473]
                  dark:text-white
                "
              >
                Welcome back
              </h1>

              <p
                className="
                  mt-1.5
                  text-[14px]
                  leading-relaxed
                  text-[#7C93B4]
                "
              >
                Sign into your dashboard.
              </p>
            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {gateStatus === "opening" && (
              <div
                aria-live="polite"
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[#29C5E8]/30
                  bg-[#29C5E8]/10
                  px-4
                  py-2.5
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    shrink-0
                    animate-pulse
                    rounded-full
                    bg-[#29C5E8]
                  "
                />

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#1C93AF]
                    dark:text-[#29C5E8]
                  "
                >
                  Access granted — opening the gate
                </p>
              </div>
            )}

            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <div className="mt-5">
              <LoginForm
                onSubmit={handleLogin}
                isLoading={loading}
                error={error}
                gateStatus={gateStatus}
              />
            </div>

            {/* =================================================
                REGISTER DISABLED
            =================================================

                Register functionality has been intentionally
                disabled/commented out.

                It can be enabled later if needed.

            ================================================= */}

            {/*
            <div className="my-4 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />

              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#7C93B4]
                "
              >
                or
              </span>

              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              className="
                w-full
                rounded-xl
                border
                border-border
                bg-[#F2F6FB]
                py-2.5
                text-[15px]
                font-semibold
                text-[#3B5473]
                transition-colors
                hover:border-[#29C5E8]/40
                hover:bg-[#29C5E8]/10
                hover:text-[#1C93AF]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#29C5E8]/50
                dark:bg-slate-800/40
                dark:text-white
                dark:hover:text-[#29C5E8]
              "
            >
              Create an admin account
            </button>
            */}
          </div>
        </div>
      </section>
    </main>
  );
}
