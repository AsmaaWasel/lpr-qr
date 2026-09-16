"use client";

import { Moon, Sun, Globe2 } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";
import { useEffect, useState } from "react";

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
    description: "Manage system cameras",
  },

  "/dashboard/lpr/plates": {
    title: "Plate numbers",
    description: "Manage allowed vehicle plate numbers",
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
    description: "Manage system readers",
  },

  "/dashboard/users": {
    title: "Users",
    description: "Manage system users",
  },

  "/dashboard/residents": {
    title: "Residents",
    description: "Manage building residents",
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

  "/dashboard/units": {
    title: "Units",
    description: "Manage system units",
  },

  "/dashboard/profile": {
    title: "Profile",
    description: "Manage your profile information",
  },

  "/dashboard/resident-profile": {
    title: "Profile",
    description: "Manage your profile information",
  },
};

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const current = normalize(pathname);
  const isDark = resolvedTheme === "dark";

  const [role, setRole] = useState<string>("");

  // =========================
  // GET ROLE FROM LOCAL STORAGE
  // =========================

  useEffect(() => {
    try {
      /*
       * لو الـ user محفوظ بالشكل:
       * localStorage.setItem("user", JSON.stringify(user))
       */

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.role) {
          setRole(String(parsedUser.role).toUpperCase());
          return;
        }
      }

      /*
       * لو الـ role نفسه محفوظ:
       * localStorage.setItem("role", user.role)
       */

      const storedRole = localStorage.getItem("role");

      if (storedRole) {
        setRole(storedRole.toUpperCase());
      }
    } catch (error) {
      console.error("Failed to read user role:", error);
    }
  }, []);

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
  // PROFILE NAVIGATION
  // =========================

  const handleProfileClick = () => {
    const currentRole = role.toUpperCase();

    if (
      currentRole === "ADMIN" ||
      currentRole === "SUPER_ADMIN" ||
      currentRole === "SUPERADMIN"
    ) {
      router.push("/dashboard/admin-profile");
      return;
    }

    if (currentRole === "RESIDENT") {
      router.push("/dashboard/resident-profile");
      return;
    }

    // fallback
    router.push("/dashboard/admin-profile");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    localStorage.removeItem("user");
    localStorage.removeItem("role");

    router.push("/");
  };

  return (
    <header
      className="
        flex
        min-h-[64px]
        items-center
        justify-between
        rounded-[20px]
        bg-card
        px-4
        py-3
        shadow-sm
        md:px-5
      "
      suppressHydrationWarning
    >
      {/* ================= PAGE TITLE ================= */}

      <div>
        <h1
          className="
            text-[18px]
            font-[700]
            leading-tight
            text-foreground
            dark:text-white
            md:text-[25px]
          "
        >
          {page.title}
        </h1>

        <p
          className="
            mt-0.5
            text-[15px]
            font-[600]
            leading-relaxed
            text-[#7C93B4]
          "
        >
          {page.description}
        </p>
      </div>

      {/* ================= RIGHT ACTIONS ================= */}

      <div className="flex items-center gap-2 md:gap-2.5">
        {/* ================= FAULT ================= */}

        <div
          className="
            hidden
            h-9
            items-center
            gap-2
            rounded-full
            bg-secondary
            px-3
            text-sm
            font-semibold
            text-foreground
            md:flex
          "
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-red-500
                opacity-75
              "
            />

            <span
              className="
                relative
                inline-flex
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
              "
            />
          </span>

          <span className="text-[14px] font-[600] text-[#D64B68]">Fault</span>
        </div>

        {/* ================= TIME ================= */}

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            bg-secondary
            px-3
            py-1.5
            text-sm
            font-semibold
            text-foreground
            md:flex
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-brand
                opacity-75
              "
            />

            <span
              className="
                relative
                inline-flex
                h-1.5
                w-1.5
                rounded-full
                bg-brand
              "
            />
          </span>

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
            h-9
            items-center
            gap-1.5
            rounded-full
            bg-secondary
            px-2.5
            transition
            hover:bg-secondary
            dark:hover:bg-slate-700
          "
          aria-label="Toggle theme"
        >
          <div
            className={`
              flex
              h-6
              w-6
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
            <Sun size={15} />
          </div>

          <div
            className={`
              flex
              h-6
              w-6
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
            <Moon size={14} />
          </div>
        </button>

        {/* ================= LANGUAGE ================= */}

        <button
          type="button"
          className="
            hidden
            h-9
            items-center
            gap-1.5
            rounded-full
            bg-secondary
            px-3
            text-sm
            font-semibold
            text-foreground
            hover:bg-secondary
            md:flex
          "
        >
          <Globe2 size={16} />
          <span>EN / ع</span>
        </button>

        {/* ================= PROFILE ================= */}

        <button
          type="button"
          onClick={handleProfileClick}
          title="Open Profile"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-ink
            text-sm
            font-bold
            text-white
            transition
            hover:scale-105
            hover:opacity-90
            active:scale-95
          "
        >
          {initials}
        </button>

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            hidden
            items-center
            gap-1.5
            ml-2
            text-base
            font-extrabold
            transition
            md:flex
          "
        >
          <span className="text-[15px] font-[600] text-[#D64B68]">Logout</span>
        </button>
      </div>
    </header>
  );
}
