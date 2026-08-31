"use client";

import { Mail, Shield, UserRound } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";

export default function AdminProfilePage() {
  const { user } = useAuth();

  const username = user?.username || "User";

  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "US";

  const role = user?.role?.toUpperCase();

  const roleLabel =
    role === "SUPER_ADMIN"
      ? "Super Admin"
      : role === "ADMIN"
        ? "Administrator"
        : role || "Administrator";

  return (
    <div className="space-y-5">
      {/* ================= PROFILE CARD ================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm
        "
      >
        {/* TOP COVER */}

        <div
          className="
            h-32
            bg-gradient-to-r
            from-[#16324F]
            to-[#0B1B30]
          "
        />

        {/* PROFILE CONTENT */}

        <div className="px-6 pb-7 md:px-8">
          {/* AVATAR */}

          <div className="-mt-12 mb-5">
            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-2xl
                border-4
                border-card
                bg-ink
                text-2xl
                font-bold
                text-white
                shadow-lg
              "
            >
              {initials}
            </div>
          </div>

          {/* NAME */}

          <div>
            <h2 className="text-2xl font-bold text-foreground">{username}</h2>

            <p className="mt-1 text-sm font-medium text-[#7C93B4]">
              {roleLabel}
            </p>
          </div>

          {/* INFO */}

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* USERNAME */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-brand/10
                    text-brand
                  "
                >
                  <UserRound size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Username
                  </p>

                  <p className="mt-1 text-base font-semibold text-foreground">
                    {user?.username || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* EMAIL */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-brand/10
                    text-brand
                  "
                >
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 truncate text-base font-semibold text-foreground">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* ROLE */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
                md:col-span-2
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-brand/10
                    text-brand
                  "
                >
                  <Shield size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Role
                  </p>

                  <p className="mt-1 text-base font-semibold text-foreground">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
