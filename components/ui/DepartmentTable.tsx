"use client";

import { Department } from "@/modules/types/department";
import { Check } from "lucide-react";

type Props = {
  data: Department[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function DepartmentTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="w-full bg-card shadow-sm">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
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

          {/* =========================
              BODY
          ========================= */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
                    {/* =========================
                        SELECT
                    ========================= */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(department.id);
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
                        aria-label={`Select ${
                          department.name || department.id
                        }`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                    </td>

                    {/* =========================
                        DEPARTMENT NAME
                    ========================= */}
                    <td className="px-6 py-4">
                      <p
                        className="
                          text-[16px]
                          font-[600]
                          text-foreground
                          dark:text-white
                        "
                      >
                        {department.name || "-"}
                      </p>
                    </td>

                    {/* =========================
                        DESCRIPTION
                    ========================= */}
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

                    {/* =========================
                        DEPARTMENT ID
                    ========================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#29C5E8]
                          dark:text-white
                        "
                      >
                        #{department.id}
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
