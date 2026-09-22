"use client";

import { Moon, Sun, Globe2, LogOut } from "lucide-react";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
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
    description: "Monitor license plates in real time",
  },
  "/dashboard/lpr/gates": {
    title: "Gates",
    description: "Manage system gates",
  },

  "/dashboard/lpr/plates": {
    title: "Plates",
    description: "Manage registered license plates",
  },

  "/dashboard/qr": {
    title: "QR",
    description: "Manage QR access and scanning",
  },

  "/dashboard/qr/qr": {
    title: "QR Codes",
    description: "Manage system QR codes",
  },

  "/dashboard/residents": {
    title: "Residents",
    description: "Manage residents and access",
  },

  "/dashboard/reports": {
    title: "Reports",
    description: "View and manage system reports",
  },

  "/dashboard/departments": {
    title: "Departments",
    description: "Manage system departments",
  },
};

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const pathname = usePathname();

  const current = normalize(pathname);

  const isDark = resolvedTheme === "dark";

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
    if (current.startsWith("/dashboard/lpr/gates")) {
      return {
        title: "Gates",
        description: "Manage system gates",
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

  const username = user?.username || "User";

  const initials = username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    // لو عندك logout في AuthContext
    // استبدل السطر ده بالدالة الموجودة عندك
    console.log("Logout");
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
            text-xl
            font-bold
            text-foreground

            dark:text-white

            md:text-[21px]
          "
        >
          {page.title}
        </h1>

        <p
          className="
            mt-0.5
            text-sm
            font-medium
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
        {/* ================= FAULT ================= */}

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            bg-danger-soft
            px-4
            py-2
            text-sm
            font-semibold
            text-danger

            dark:bg-rose-500/10

            md:flex
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-danger
            "
          />

          <span>1 fault</span>
        </div>

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
            text-sm
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

              ${isDark ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}
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
            text-sm
            font-semibold
            text-foreground
            hover:bg-secondary

            md:flex
          "
        >
          <Globe2 size={16} />
          EN / ع
        </button>

        {/* ================= AVATAR ================= */}

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-ink
            text-sm
            font-bold
            text-white

          "
        >
          {initials || "US"}
        </div>

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            hidden
            items-center
            gap-1
            text-sm
            font-semibold
            text-danger
            hover:text-danger

            md:flex
          "
        >
          <span>Logout</span>

          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
