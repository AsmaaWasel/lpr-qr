"use client";


import { Unit } from "@/modules/types/units";
import { Check } from "lucide-react";

type Props = {
  data: Unit[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function UnitTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="w-full bg-card shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          {/* HEADER */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
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

              {/* ID */}

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
                ID
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
                UNIT NAME
              </th>

              {/* TYPE */}

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
                TYPE
              </th>

              {/* PARENT */}

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
                PARENT ID
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
            </tr>
          </thead>

          {/* BODY */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No units found
                </td>
              </tr>
            ) : (
              data.map((unit) => {
                const isSelected = selectedId === unit.id;

                return (
                  <tr
                    key={unit.id}
                    onClick={() => onSelect(unit.id)}
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
                    {/* SELECT */}

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(unit.id);
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
                        aria-label={`Select ${unit.name}`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                    </td>

                    {/* ID */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[600]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {unit.id}
                      </span>
                    </td>

                    {/* NAME */}

                    <td className="px-6 py-4">
                      <p
                        className="
                          text-[16px]
                          font-[600]
                          text-foreground
                          dark:text-white
                        "
                      >
                        {unit.name}
                      </p>
                    </td>

                    {/* TYPE */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-emerald-50
                          px-3
                          py-1
                          text-[16px]
                          font-[500]
                          text-emerald-600
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        "
                      >
                        {unit.type}
                      </span>
                    </td>

                    {/* PARENT ID */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          inline-flex
                          min-w-[45px]
                          items-center
                          justify-center
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-[16px]
                          font-[600]
                          text-[#3B5473]
                          dark:bg-slate-700
                          dark:text-white
                        "
                      >
                        {unit.parent_id ?? "-"}
                      </span>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          block
                          max-w-[350px]
                          truncate
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                        title={unit.description || "-"}
                      >
                        {unit.description || "-"}
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
