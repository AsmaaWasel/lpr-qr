"use client";

import { useState } from "react";
import { Gate } from "@/modules/types/gate";
import { Check, Loader2 } from "lucide-react";

type Props = {
  data: Gate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onActiveChange?: (gateId: number, active: boolean) => Promise<void>;
};

export default function GatesTable({
  data,
  selectedId,
  onSelect,
  onActiveChange,
}: Props) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================

  const handleToggleActive = async (e: React.MouseEvent, gate: Gate) => {
    e.stopPropagation();

    if (!onActiveChange) return;

    try {
      setUpdatingId(gate.id);

      const newActive = !gate.active;

      await onActiveChange(gate.id, newActive);
    } catch (error) {
      console.error("Failed to update gate active status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full bg-card shadow-sm">
      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          {/* =====================================================
              HEADER
          ===================================================== */}

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
              {/* ================= SELECT ================= */}

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

              {/* ================= GATE NAME ================= */}

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

              {/* ================= TYPE ================= */}

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

              {/* ================= IP ================= */}

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
                IP ADDRESS
              </th>

              {/* ================= DESCRIPTION ================= */}

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

              {/* ================= ACTIVE ================= */}

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
                ACTIVE
              </th>
            </tr>
          </thead>

          {/* =====================================================
              BODY
          ===================================================== */}

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
                  No gates found
                </td>
              </tr>
            ) : (
              data.map((gate) => {
                const isSelected = selectedId === gate.id;
                const isUpdating = updatingId === gate.id;

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
                    {/* =================================================
                        SELECT
                    ================================================= */}

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

                    {/* =================================================
                        GATE NAME
                    ================================================= */}

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

                    {/* =================================================
                        TYPE
                    ================================================= */}

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

                    {/* =================================================
                        IP
                    ================================================= */}

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

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

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

                    {/* =================================================
                        ACTIVE TOGGLE
                    ================================================= */}

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={(e) => handleToggleActive(e, gate)}
                        className={`
                          relative
                          inline-flex
                          h-7
                          w-12
                          shrink-0
                          items-center
                          rounded-full
                          transition-colors
                          duration-200
                          focus:outline-none
                          focus:ring-2
                          focus:ring-brand
                          focus:ring-offset-2
                          dark:focus:ring-offset-slate-900
                          ${
                            gate.active
                              ? "bg-emerald-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }
                          ${
                            isUpdating
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }
                        `}
                        aria-label={`Toggle ${gate.name} active status`}
                        aria-pressed={gate.active}
                      >
                        {isUpdating ? (
                          <span className="flex w-full items-center justify-center">
                            <Loader2
                              size={14}
                              className="animate-spin text-white"
                            />
                          </span>
                        ) : (
                          <span
                            className={`
                              inline-block
                              h-5
                              w-5
                              rounded-full
                              bg-white
                              shadow
                              transition-transform
                              duration-200
                              ${gate.active ? "translate-x-6" : "translate-x-1"}
                            `}
                          />
                        )}
                      </button>

                      {/* Status text */}

                      <span
                        className={`
                          ml-3
                          text-sm
                          font-medium
                          ${
                            gate.active
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        `}
                      >
                        {gate.active ? "Active" : "Inactive"}
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
