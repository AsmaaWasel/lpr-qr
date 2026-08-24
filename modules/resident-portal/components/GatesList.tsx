"use client";

import { useRef } from "react";
import Gate from "@/modules/sharedComponents/gate-entries/Gate";

type GateType = {
  id: number;
  name: string;
  desc: string;
  x?: number;
  y?: number;
  isOpen?: boolean;
  entryCount?: number;
};

type GatePosition = {
  x: number;
  y: number;
};

type Props = {
  gates: GateType[];
  gatePositions: Record<string, GatePosition>;
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType) => void;
  onPositionChange: (gateId: number, x: number, y: number) => void;
  trafficColors: {
    light: string;
    medium: string;
    heavy: string;
  };
  getCongestionLevel: (count: number) => "light" | "medium" | "heavy";
};

export default function GateHeatMap({
  gates,
  gatePositions,
  selectedGate,
  onSelectGate,
  onPositionChange,
  trafficColors,
  getCongestionLevel,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    gateId: number,
  ) => {
    e.stopPropagation();

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    gateId: number,
  ) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    const map = mapRef.current;
    if (!map) return;

    const rect = map.getBoundingClientRect();

    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.min(95, Math.max(5, x));
    y = Math.min(95, Math.max(5, y));

    onPositionChange(gateId, x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={mapRef}
      className="relative h-[420px] rounded-xl overflow-hidden border border-border bg-slate-900/50"
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full grid grid-cols-10 grid-rows-6">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border border-border" />
          ))}
        </div>
      </div>

      {/* Gates */}
      {gates.map((gate) => {
        const savedPosition = gatePositions[String(gate.id)];

        const x = savedPosition?.x ?? gate.x ?? 50;
        const y = savedPosition?.y ?? gate.y ?? 50;

        const entryCount = gate.entryCount ?? 0;

        const level = getCongestionLevel(entryCount);

        const isSelected = selectedGate?.id === gate.id;

        const trafficColor = trafficColors[level];

        return (
          <div
            key={gate.id}
            onPointerDown={(e) => handlePointerDown(e, gate.id)}
            onPointerMove={(e) => handlePointerMove(e, gate.id)}
            onPointerUp={handlePointerUp}
            onClick={() => onSelectGate(gate)}
            className="
              absolute
              cursor-grab
              active:cursor-grabbing
              touch-none
              select-none
              group
            "
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isSelected ? 30 : 20,
            }}
          >
            <div
              className={`
                relative
                flex
                flex-col
                items-center
                justify-center
                transition-transform
                duration-150
                ${isSelected ? "scale-110" : "hover:scale-105"}
              `}
            >
              {/* Gate */}
              <Gate open={gate.isOpen ?? false} size="sm" />

              {/* Gate Name */}
              <span className="text-[8px] text-muted-foreground mt-1 font-medium whitespace-nowrap">
                {gate.name.length > 8
                  ? gate.name.substring(0, 8) + ".."
                  : gate.name}
              </span>

              {/* Traffic Badge */}
              <div
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full border border-border flex items-center justify-center text-[8px] font-bold text-foreground"
                style={{
                  backgroundColor: trafficColor,
                }}
              >
                {entryCount}
              </div>

              {/* Selected Border */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-xl border-2 border-brand pointer-events-none" />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                <div className="bg-slate-900/95 rounded-lg border border-border px-2 py-1 shadow-xl">
                  <span className="text-foreground text-[10px] font-bold">
                    {gate.name}
                  </span>

                  <span
                    className="text-[10px] ml-1"
                    style={{
                      color: trafficColor,
                    }}
                  >
                    ({entryCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {gates.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">↕</div>

            <p className="text-sm">No gates available</p>
          </div>
        </div>
      )}
    </div>
  );
}
