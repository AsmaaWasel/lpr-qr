"use client";

import { CongestionLevel, GateData } from "@/modules/types/gateEntry";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

type Props = {
  gates: GateData[];
  selectedGate: GateData | null;

  onSelect: (gate: GateData) => void;

  onDragStart: (e: React.DragEvent, gate: GateData) => void;

  getCongestionLevel: (count: number) => CongestionLevel;
};

export default function GatesTable({
  gates,
  selectedGate,
  onSelect,
  onDragStart,
  getCongestionLevel,
}: Props) {
  return (
    <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold flex items-center gap-2">
          <HiOutlineOfficeBuilding className="w-5 h-5" />
          All Gates List
          <span className="text-xs text-muted-foreground font-normal ml-2">
            (Drag any gate to the map to reposition)
          </span>
        </h2>

        <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full">
          Total: {gates.length} gates
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground">#</th>

              <th className="text-left py-3 px-4 text-muted-foreground">Gate Name</th>

              <th className="text-left py-3 px-4 text-muted-foreground">
                Description
              </th>

              <th className="text-left py-3 px-4 text-muted-foreground">Status</th>

              <th className="text-left py-3 px-4 text-muted-foreground">Entries</th>

              <th className="text-left py-3 px-4 text-muted-foreground">Traffic</th>

              <th className="text-left py-3 px-4 text-muted-foreground">Action</th>
            </tr>
          </thead>

          <tbody>
            {gates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No gates available
                </td>
              </tr>
            ) : (
              gates.map((gate, index) => {
                const entryCount = gate.entryCount || 0;

                const level = getCongestionLevel(entryCount);

                const isOpen = gate.isOpen || false;

                return (
                  <tr
                    key={gate.id}
                    onClick={() => onSelect(gate)}
                    draggable
                    onDragStart={(e) => onDragStart(e, gate)}
                    className={`border-b border-border hover:bg-card cursor-grab ${
                      selectedGate?.id === gate.id ? "bg-blue-500/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-muted-foreground">#{index + 1}</td>

                    <td className="py-3 px-4 text-foreground font-medium">
                      {gate.name}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground">
                      {gate.desc || "—"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={
                          isOpen ? "text-ok" : "text-muted-foreground"
                        }
                      >
                        {isOpen ? "OPEN" : "CLOSED"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-foreground">{entryCount}</td>

                    <td className="py-3 px-4">
                      <span
                        className={
                          level === "heavy"
                            ? "text-rose-400"
                            : level === "medium"
                              ? "text-warn"
                              : "text-ok"
                        }
                      >
                        {level.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      ↕ Drag to map
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
