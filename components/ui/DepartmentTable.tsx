"use client";

import { Department } from "@/modules/types/department";

type Props = {
  data: Department[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function DepartmentTable({ data, selectedId, onSelect }: Props) {
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
          {/* ================= HEADER ================= */}

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
              {/* Select */}

              <th className="w-[70px] px-6 py-4">
                <span className="sr-only">Select</span>
              </th>

              {/* Department Name */}

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
                Department Name
              </th>

              {/* Description */}

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
                Description
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}

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
                  No departments found
                </td>
              </tr>
            ) : (
              data.map((department) => {
                const isSelected = selectedId === department.id;

                return (
                  <tr
                    key={department.id}
                    onClick={() => onSelect(department.id)}
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
                    {/* ================= SELECT ================= */}

                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          rounded
                          border-border
                          accent-cyan-500
                        "
                      />
                    </td>

                    {/* ================= DEPARTMENT ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* ID */}

                        <div
                          className="
                            flex
                            h-10
                            w-10
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
                          {department.id}
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
                            {department.name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Department #{department.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= DESCRIPTION ================= */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          block
                          max-w-md
                          truncate
                          text-sm
                          text-muted-foreground
                        "
                        title={department.description || "-"}
                      >
                        {department.description || "-"}
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
