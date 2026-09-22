"use client";

import { User } from "@/modules/types/user";
import { Check } from "lucide-react";

type Props = {
  data: User[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function UserTable({ data, selectedId, onSelect }: Props) {
  // =========================
  // ROLE COLOR
  // =========================
  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      // ADMIN - BLUE
      case "admin":
        return `
          bg-blue-50
          text-blue-700
          dark:bg-blue-500/10
          dark:text-blue-400
        `;

      // OPERATOR - PURPLE
      case "operator":
        return `
          bg-purple-50
          text-purple-700
          dark:bg-purple-500/10
          dark:text-purple-400
        `;

      // VIEWER - CYAN
      case "viewer":
        return `
          bg-cyan-50
          text-cyan-700
          dark:bg-cyan-500/10
          dark:text-cyan-400
        `;

      // MANAGER - ORANGE
      case "manager":
        return `
          bg-orange-50
          text-orange-700
          dark:bg-orange-500/10
          dark:text-orange-400
        `;

      // SECURITY - GREEN
      case "security":
        return `
          bg-emerald-50
          text-emerald-700
          dark:bg-emerald-500/10
          dark:text-emerald-400
        `;

      // DEFAULT - GRAY
      default:
        return `
          bg-slate-50
          text-slate-600
          dark:bg-slate-700
          dark:text-slate-200
        `;
    }
  };

  return (
    <div className="w-full bg-card shadow-sm">
      {/* =========================
          TABLE
      ========================= */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          {/* =========================
              HEADER
          ========================= */}
          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                text-[#7C93B4]
                dark:bg-slate-800/40
              "
            >
              {/* SELECT */}
              <th
                className="
                  w-[55px]
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                <span className="sr-only">Select</span>
              </th>

              {/* NAME */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                NAME
              </th>

              {/* EMAIL */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                EMAIL
              </th>

              {/* ROLE */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                ROLE
              </th>

              {/* DEPARTMENT */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                DEPARTMENT
              </th>
            </tr>
          </thead>

          {/* =========================
              BODY
          ========================= */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No users found
                </td>
              </tr>
            ) : (
              data.map((user) => {
                const isSelected = selectedId === user.id;

                return (
                  <tr
                    key={user.id}
                    onClick={() => onSelect(user.id)}
                    className={`
                      cursor-pointer
                      border-b
                      border-border
                      transition
                      last:border-b-0

                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* =========================
                        SELECT
                    ========================= */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(user.id);
                        }}
                        className={`
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded
                          border-2
                          transition

                          ${
                            isSelected
                              ? `
                                border-brand
                                bg-brand
                                text-white
                                hover:bg-brand-strong
                              `
                              : `
                                border-slate-300
                                bg-card
                                hover:border-brand
                                dark:border-slate-600
                              `
                          }
                        `}
                        aria-label={`Select ${user.username || user.id}`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                    </td>

                    {/* =========================
                        NAME
                    ========================= */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p
                            className="
                              text-[16px]
                              font-[600]
                              text-foreground
                              dark:text-white
                            "
                          >
                            {user.username || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        EMAIL
                    ========================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {user.email || "-"}
                      </span>
                    </td>

                    {/* =========================
                        ROLE
                    ========================= */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-[16px]
                          font-[500]
                          ${getRoleColor(user.role)}
                        `}
                      >
                        {user.role || "Unknown"}
                      </span>
                    </td>

                    {/* =========================
                        DEPARTMENT
                    ========================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {user.sub_department?.name || "-"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
