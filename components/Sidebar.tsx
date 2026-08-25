"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/shared/context/AuthContext";

import {
  LayoutDashboard,
  ScanLine,
  QrCode,
  Users,
  Home,
  BarChart3,
  Folder,
} from "lucide-react";

const normalize = (p: string) => p.split("?")[0].replace(/\/$/, "");

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const current = normalize(pathname);
  const role = user?.role;

  // =========================================================
  // NAVIGATION BASED ON ROLE
  // =========================================================

  const navigation =
    role === "superAdmin"
      ? [
          {
            id: "dashboard",
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            id: "lpr",
            label: "LPR",
            href: "/dashboard/lpr/real-time",
            icon: ScanLine,
          },
          {
            id: "qr",
            label: "QR",
            href: "/dashboard/qr/qr-generator",
            icon: QrCode,
          },
          {
            id: "users",
            label: "Users",
            href: "/dashboard/users",
            icon: Users,
          },
          {
            id: "residents",
            label: "Residents",
            href: "/dashboard/residents",
            icon: Home,
          },
          {
            id: "reports",
            label: "Reports",
            href: "/dashboard/reports/lpr",
            icon: BarChart3,
          },
          {
            id: "departments",
            label: "Depts",
            href: "/dashboard/departments",
            icon: Folder,
          },
        ]
      : role === "admin"
        ? [
            {
              id: "dashboard",
              label: "Dashboard",
              href: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              id: "lpr",
              label: "LPR",
              href: "/dashboard/lpr",
              icon: ScanLine,
            },
            {
              id: "qr",
              label: "QR",
              href: "/dashboard/qr",
              icon: QrCode,
            },
            {
              id: "residents",
              label: "Residents",
              href: "/dashboard/residents",
              icon: Home,
            },
            {
              id: "users",
              label: "Users",
              href: "/dashboard/users",
              icon: Users,
            },
            {
              id: "reports",
              label: "Reports",
              href: "/dashboard/reports",
              icon: BarChart3,
            },
            {
              id: "departments",
              label: "Depts",
              href: "/dashboard/departments",
              icon: Folder,
            },
          ]
        : [
            {
              id: "qr",
              label: "QR",
              href: "/dashboard/qr/qr",
              icon: QrCode,
            },
          ];

  // =========================================================
  // ACTIVE STATE
  // =========================================================

  const isModuleActive = (id: string, href: string) => {
    switch (id) {
      case "lpr":
        return current.startsWith("/dashboard/lpr");

      case "qr":
        return current.startsWith("/dashboard/qr");

      case "reports":
        return current.startsWith("/dashboard/reports");

      case "residents":
        return current.startsWith("/dashboard/residents");

      case "users":
        return current.startsWith("/dashboard/users");

      case "departments":
        return current.startsWith("/dashboard/departments");

      case "dashboard":
        return current === "/dashboard";

      default:
        return current === href;
    }
  };

  return (
    <aside
      className="
        fixed
        left-4
        top-4
        bottom-4
        z-50
        hidden
        w-[112px]
        flex-col
        items-center
        rounded-[25px]
        bg-card
        py-5
        shadow-sm
        lg:flex
      "
    >
      {/* =====================================================
          LOGO
      ====================================================== */}

      <div className="flex flex-col items-center">
        {/* Logo Container */}
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-gradient-to-br
            from-brand
            to-brand-strong
            shadow-sm
          "
        >
          <Image
            src="/logo.svg"
            alt="Company logo"
            width={42}
            height={42}
            className="
              h-9
              w-9
              object-contain
            "
          />
        </div>

        {/* Brand */}
        <span
          className="
            mt-2
            text-[14px]
            font-semibold
            leading-[1.1]
            tracking-[0.14em]
            text-[#29C5E8]
            dark:text-slate-200
          "
        >
          VOOM
        </span>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          mt-7
          flex
          w-full
          flex-1
          flex-col
          items-center
          gap-2
          overflow-y-auto
          px-2
          scrollbar-none
        "
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isModuleActive(item.id, item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`
                group
                flex
                w-[94px]
                shrink-0
                flex-col
                items-center
                justify-center
                gap-1.5
                rounded-lg
                py-3
                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-accent
                      dark:bg-cyan-500/15
                    `
                    : `
                      hover:bg-secondary
                      dark:hover:bg-secondary
                    `
                }
              `}
            >
              {/* ICON */}
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                className={`
                  transition-transform
                  duration-200
                  group-hover:scale-105

                  ${
                    active
                      ? "text-[#29C5E8]"
                      : "text-[#0B1B30] dark:text-slate-200"
                  }
                `}
              />

              {/* TEXT */}
              <span
                className={`
                  max-w-[82px]
                  truncate
                  text-center
                  text-[13px]
                  font-semibold
                  leading-[1.1]

                  ${
                    active
                      ? "text-[#29C5E8]"
                      : "text-[#0B1B30] dark:text-slate-200"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          ONLINE GATES STATUS
      ====================================================== */}
      <div
        className="
          mt-4
          flex
          w-[94px]
          shrink-0
          flex-col
          items-center
          justify-center
          rounded-2xl
          bg-[#F2F6FB]
          py-3
        "
      >
        {/* Status Indicator */}
        <div className="relative mb-2 flex h-7 w-7 items-center justify-center">
          {/* Outer pulse */}
          <span
            className="
              absolute
              h-7
              w-7
              animate-ping
              rounded-full
              bg-[#2FD3C2]/30
            "
          />

          {/* Main circle */}
          <span
            className="
              relative
              h-3.5
              w-3.5
              rounded-full
              bg-[#2FD3C2]
              shadow-[0_0_10px_rgba(47,211,194,0.45)]
            "
          />
        </div>

        {/* Gates Count */}
        <span
          className="
            text-[15px]
            font-bold
            leading-none
            text-[#0B1B30]
          "
        >
          3/4
        </span>

        {/* Label */}
        <span
          className="
            mt-1.5
            text-center
            text-[10px]
            font-medium
            leading-none
            text-[#718096]
          "
        >
          Online Gates
        </span>
      </div>
    </aside>
  );
}
