"use client";

import { User } from "@/modules/types/user";

type Props = {
  data: User[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function UserTable({ data, selectedId, onSelect }: Props) {
  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

      case "operator":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "viewer":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

      case "manager":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

      case "security":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";

      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        bg-card
        shadow-sm
      "
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          {/* =========================
              HEADER
          ========================= */}
          <thead>
            <tr
              className="
                border-b
                border-border
                bg-slate-50/70
                text-left
                dark:bg-slate-800/40
              "
            >
              {/* User */}
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
                Name
              </th>

              {/* Email */}
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
                Email
              </th>

              {/* Role */}
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
                Role
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
                  colSpan={3}
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
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
                        USER
                    ========================= */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* ID */}
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            text-sm
                            font-bold
                            text-brand-strong
                            dark:bg-cyan-500/10
                          "
                        >
                          {user.id}
                        </div>

                        {/* Name */}
                        <div>
                          <p
                            className="
                              text-sm
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {user.username || "-"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            User #{user.id}
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
                          text-sm
                          font-medium
                          text-foreground
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
                          text-xs
                          font-bold
                          ${getRoleColor(user.role)}
                        `}
                      >
                        {user.role || "Unknown"}
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
