"use client";

import { HiOutlineOfficeBuilding } from "react-icons/hi";

// =====================================================
// TYPES
// =====================================================

export type GateItem = {
  id: number;
  name: string;
  desc?: string | null;
  x?: number;
  y?: number;
  isOpen?: boolean;
  queueCount?: number;
  entryCount?: number;
};

export type CongestionLevel = "light" | "medium" | "heavy";

type GatesTableProps = {
  gates: GateItem[];
  selectedGate: GateItem | null;

  handleGateSelect: (gate: GateItem) => void;

  handleDragStart: (e: React.DragEvent, gate: GateItem) => void;

  handleDragEnd: () => void;

  getCongestionLevelByEntryCount: (entryCount: number) => CongestionLevel;
};

// =====================================================
// COMPONENT
// =====================================================

export default function GatesTable({
  gates,
  selectedGate,
  handleGateSelect,
  handleDragStart,
  handleDragEnd,
  getCongestionLevelByEntryCount,
}: GatesTableProps) {
  return (
    <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6 mb-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-brand" />
            All Gates List
            <span className="text-sm font-medium text-muted-foreground ml-2">
              You can drag and drop gates into the map.
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border">
            <span className="text-[16px] font-[700] text-[#0E2038]">
              Total:
            </span>

            <span className="text-[16px] font-[700] text-[#0E2038]">
              {gates.length} Gates
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-[#F2F6FB] dark:bg-slate-800/40 text-[#7C93B4]">
              <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                Gate Name
              </th>

              <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                Description
              </th>

              <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                Status
              </th>

              <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                Entries
              </th>

              <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                Traffic
              </th>
            </tr>
          </thead>

          <tbody>
            {gates.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-lg text-muted-foreground"
                >
                  No gates available
                </td>
              </tr>
            ) : (
              gates.map((gate) => {
                const entryCount = gate.entryCount || 0;

                const level = getCongestionLevelByEntryCount(entryCount);

                const isOpen = gate.isOpen || false;

                const isSelected = selectedGate?.id === gate.id;

                return (
                  <tr
                    key={gate.id}
                    onClick={() => handleGateSelect(gate)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, gate)}
                    onDragEnd={handleDragEnd}
                    className={`
                      cursor-grab
                      active:cursor-grabbing
                      border-b
                      border-border
                      transition-all
                      duration-200
                      last:border-b-0
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                      hover:scale-[1.01]
                      hover:shadow-md
                      select-none
                    `}
                  >
                    {/* =========================
                        GATE NAME
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground opacity-40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="9" r="2" />
                            <circle cx="21" cy="15" r="2" />
                            <circle cx="3" cy="21" r="2" />
                            <line x1="9" y1="9" x2="21" y2="15" />
                            <line x1="9" y1="9" x2="3" y2="21" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[16px] font-[600] text-foreground dark:text-white">
                            {gate.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <td className="px-6 py-4">
                      <span className="text-[16px] font-[500] text-[#3B5473] dark:text-white">
                        {gate.desc || "—"}
                      </span>
                    </td>

                    {/* =========================
                        STATUS
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className={`
                          text-[16px]
                          font-[600]
                          ${
                            isOpen
                              ? "text-[#10b981]"
                              : "text-[#3B5473] dark:text-white"
                          }
                        `}
                      >
                        {isOpen ? "OPEN" : "CLOSED"}
                      </span>
                    </td>

                    {/* =========================
                        ENTRIES
                    ========================= */}

                    <td className="px-6 py-4">
                      <span className="text-[16px] font-[500] text-[#3B5473] dark:text-white">
                        {entryCount}
                      </span>
                    </td>

                    {/* =========================
                        TRAFFIC
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className={`
                          text-[16px]
                          font-[600]
                          ${
                            level === "heavy"
                              ? "text-rose-400"
                              : level === "medium"
                                ? "text-warn"
                                : "text-ok"
                          }
                        `}
                      >
                        {level.toUpperCase()}
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
