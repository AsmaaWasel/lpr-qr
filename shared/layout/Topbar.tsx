"use client";

import { Moon, Sun, Globe2, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";

const normalize = (p: string) => p.split("?")[0].replace(/\/$/, "");

const PAGE_INFO: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "/dashboard": {
    title: "SmartGate statistical dashboard",
    description:
      "Real-time behaviour tracking, safety indices and facility load",
  },

  "/dashboard/lpr": {
    title: "LPR",
    description: "Manage license plate recognition",
  },

  "/dashboard/lpr/real-time": {
    title: "Real-time gate management",
    description: "Live monitoring and control system",
  },
  "/dashboard/lpr/gates": {
    title: "Gates",
    description: "Manage system gates",
  },

  "/dashboard/lpr/cameras": {
    title: "Cameras",
    description: "Manage system cameras and entry points",
  },

  "/dashboard/lpr/plates": {
    title: "Plate numbers",
    description: "Manage allowed vehicle plate numbers for the LPR system",
  },

  "/dashboard/qr": {
    title: "QR",
    description: "Manage QR access and scanning",
  },

  "/dashboard/qr/qr-generator": {
    title: "QR access management",
    description: "Generate visitor QR codes",
  },
  "/dashboard/qr/qr-readers": {
    title: "QR readers",
    description: "Manage system readers and entry points",
  },

  "/dashboard/users": {
    title: "Users",
    description: "Manage system users",
  },

  "/dashboard/residents": {
    title: "Residents",
    description: "Manage residents and access",
  },

  "/dashboard/reports": {
    title: "Reports",
    description: "View and manage system reports",
  },

  "/dashboard/reports/lpr": {
    title: "Gate entries",
    description: "Monitor all gate entries and exits",
  },

  "/dashboard/departments": {
    title: "Departments",
    description: "Manage system departments",
  },
};

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const current = normalize(pathname);

  const isDark = resolvedTheme === "dark";

  // =========================
  // PAGE INFO
  // =========================

  const getPageInfo = () => {
    if (PAGE_INFO[current]) {
      return PAGE_INFO[current];
    }

    if (current.startsWith("/dashboard/lpr")) {
      return {
        title: "LPR",
        description: "Manage license plate recognition",
      };
    }

    if (current.startsWith("/dashboard/qr")) {
      return {
        title: "QR",
        description: "Manage QR access and scanning",
      };
    }

    if (current.startsWith("/dashboard/reports")) {
      return {
        title: "Reports",
        description: "View and manage system reports",
      };
    }

    if (current.startsWith("/dashboard/residents")) {
      return {
        title: "Residents",
        description: "Manage residents and access",
      };
    }

    return {
      title: "Dashboard",
      description: "Overview of your system",
    };
  };

  const page = getPageInfo();

  // =========================
  // USER
  // =========================

  const username = user?.username || "User";

  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "US";

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header
      className="
        flex
        min-h-[74px]
        items-center
        justify-between
        rounded-[24px]
        bg-card
        px-5
        py-4
        shadow-sm
        md:px-7
      "
      suppressHydrationWarning
    >
      {/* ================= PAGE TITLE ================= */}

      <div>
        <h1
          className="
      text-[26px]
      font-extrabold
      leading-tight
      text-foreground
      dark:text-white
      md:text-[28px]
    "
        >
          {page.title}
        </h1>

        <p
          className="
      mt-1
      text-lg
      font-medium
      leading-relaxed
      text-muted-foreground
    "
        >
          {page.description}
        </p>
      </div>

      {/* ================= RIGHT ACTIONS ================= */}

      <div
        className="
          flex
          items-center
          gap-2
          md:gap-3
        "
      >
        {/* ================= TIME ================= */}

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            bg-secondary
            px-4
            py-2
            text-base
            font-semibold
            text-foreground
            md:flex
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-brand
            "
          />

          <span>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* ================= THEME ================= */}

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-full
            bg-secondary
            px-3
            transition
            hover:bg-secondary
            dark:hover:bg-slate-700
          "
          aria-label="Toggle theme"
        >
          {/* Sun */}

          <div
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              transition
              ${
                !isDark
                  ? "bg-card text-amber-400 shadow-sm"
                  : "bg-slate-700 text-muted-foreground"
              }
            `}
          >
            <Sun size={16} />
          </div>

          {/* Moon */}

          <div
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              transition
              ${
                isDark
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }
            `}
          >
            <Moon size={15} />
          </div>
        </button>

        {/* ================= LANGUAGE ================= */}

        <button
          type="button"
          className="
            hidden
            h-10
            items-center
            gap-2
            rounded-full
            bg-secondary
            px-4
            text-base
            font-semibold
            text-foreground
            hover:bg-secondary
            md:flex
          "
        >
          <Globe2 size={17} />

          <span>EN / ع</span>
        </button>

        {/* ================= AVATAR ================= */}

        <div
          className="
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-lg
    bg-ink
    text-base
    font-bold
    text-white
  "
        >
          {initials}
        </div>

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          onClick={handleLogout}
          className="
    hidden
    items-center
    gap-1.5
    text-lg
    font-extrabold
    text-danger
    transition
    hover:text-danger
    md:flex
  "
        >
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
