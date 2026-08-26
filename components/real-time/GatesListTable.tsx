"use client";

import { HiOutlineOfficeBuilding } from "react-icons/hi";

type CongestionLevel = "light" | "medium" | "heavy";

type Gate = {
  id: number;
  name: string;
  desc?: string;
  isOpen?: boolean;
  entryCount?: number;
};

type Props = {
  gates: Gate[];
  selectedGate: Gate | null;
  handleGateSelect: (gate: Gate) => void;
  getCongestionLevelByEntryCount: (entryCount: number) => CongestionLevel;
};

export default function GatesListTable({
  gates,
  selectedGate,
  handleGateSelect,
  getCongestionLevelByEntryCount,
}: Props) {
  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <HiOutlineOfficeBuilding className="h-5 w-5" />
          All Gates List
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            (Drag any gate to the map to reposition)
          </span>
        </h2>

        <span className="rounded-full bg-card px-3 py-1 text-lg text-muted-foreground">
          Total: {gates.length} gates
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          {/* Header */}
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
                Gate Name
              </th>

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
                Status
              </th>

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
                Entries
              </th>

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
                Traffic
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {gates.length === 0 ? (
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
                    {/* Gate Name */}
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

                    {/* Description */}
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
                        title={gate.desc || "—"}
                      >
                        {gate.desc || "—"}
                      </span>
                    </td>

                    {/* Status */}
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

                    {/* Entries */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {entryCount}
                      </span>
                    </td>

                    {/* Traffic */}
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
