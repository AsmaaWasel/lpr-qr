"use client";

import { Gate } from "@/modules/types/gate";
import { Check } from "lucide-react";

type Props = {
  data: Gate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function GatesTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="w-full bg-card shadow-sm">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          {/* ================= HEADER ================= */}
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

              {/* GATE NAME */}
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
                GATE NAME
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

              {/* IP */}
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
                IP Address
              </th>

              {/* ENTRIES TODAY */}
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
                ENTRIES TODAY
              </th>

              {/* EXITS TODAY */}
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
                EXITS TODAY
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

          {/* ================= BODY ================= */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No gates found
                </td>
              </tr>
            ) : (
              data.map((gate) => {
                const isSelected = selectedId === gate.id;

                return (
                  <tr
                    key={gate.id}
                    onClick={() => onSelect(gate.id)}
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(gate.id);
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
                        aria-label={`Select ${gate.name}`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </button>
                    </td>

                    {/* ================= GATE NAME ================= */}
                    <td className="px-6 py-4">
                      <p
                        className="
                          text-[16px]
                          font-[600]
                          text-foreground
                          dark:text-white
                        "
                      >
                        {gate.name}
                      </p>
                    </td>

                    {/* ================= TYPE ================= */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-[16px]
                          font-[500]
                          ${
                            gate.type === "ENTRY"
                              ? `
                                bg-emerald-50
                                text-ok
                                dark:bg-emerald-500/10
                                dark:text-emerald-400
                              `
                              : `
                                bg-amber-50
                                text-warn
                                dark:bg-amber-500/10
                                dark:text-amber-400
                              `
                          }
                        `}
                      >
                        {gate.type}
                      </span>
                    </td>

                    {/* ================= IP ================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {gate.ip || "-"}
                      </span>
                    </td>

                    {/* ================= ENTRIES TODAY ================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          inline-flex
                          min-w-[45px]
                          items-center
                          justify-center
                          rounded-full
                          bg-emerald-50
                          px-3
                          py-1
                          text-[16px]
                          font-[600]
                          text-emerald-600
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        "
                      >
                        {gate.entries_today ?? 0}
                      </span>
                    </td>

                    {/* ================= EXITS TODAY ================= */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          inline-flex
                          min-w-[45px]
                          items-center
                          justify-center
                          rounded-full
                          bg-amber-50
                          px-3
                          py-1
                          text-[16px]
                          font-[600]
                          text-amber-600
                          dark:bg-amber-500/10
                          dark:text-amber-400
                        "
                      >
                        {gate.exits_today ?? 0}
                      </span>
                    </td>

                    {/* ================= DESCRIPTION ================= */}
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
                        title={gate.desc || "-"}
                      >
                        {gate.desc || "-"}
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
