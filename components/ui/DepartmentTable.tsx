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
        bg-card
        shadow-sm
      "
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                dark:bg-slate-800/40
                text-[#7C93B4]
              "
            >
              {/* DEPARTMENT NAME */}
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
                DEPARTMENT NAME
              </th>

              {/* DESCRIPTION */}
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
                DESCRIPTION
              </th>

              {/* DEPARTMENT ID */}
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
                DEPARTMENT ID
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
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
                    {/* DEPARTMENT NAME */}
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
                            {department.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          block
                          max-w-[400px]
                          truncate
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                        title={department.description || "-"}
                      >
                        {department.description || "-"}
                      </span>
                    </td>

                    {/* DEPARTMENT ID */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {department.id}
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
