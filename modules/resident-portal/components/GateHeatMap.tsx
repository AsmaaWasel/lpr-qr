"use client";

import Gate from "@/modules/sharedComponents/gate-entries/Gate";
import { GateData, GatePosition } from "@/modules/types/gateEntry";

type Props = {
  gates: GateData[];
  gatePositions: Record<string, GatePosition>;
  mapImage: string | null;

  selectedGate: GateData | null;

  trafficSettings: {
    colors: {
      light: string;
      medium: string;
      heavy: string;
    };
    heavy: number;
  };

  mediumThreshold: number;

  mapRef: React.RefObject<HTMLDivElement | null>;

  isDragging: boolean;
  dragPosition: GatePosition | null;
  draggedGate: GateData | null;

  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;

  onSelectGate: (gate: GateData) => void;

  onPointerDown: (e: React.PointerEvent, gateId: string) => void;

  onPointerMove: (e: React.PointerEvent, gateId: string) => void;

  getCongestionLevel: (count: number) => "light" | "medium" | "heavy";
};

export default function GateHeatMap({
  gates,
  gatePositions,
  mapImage,
  selectedGate,
  trafficSettings,
  mediumThreshold,
  mapRef,
  isDragging,
  dragPosition,
  draggedGate,
  onDragOver,
  onDrop,
  onSelectGate,
  onPointerDown,
  onPointerMove,
  getCongestionLevel,
}: Props) {
  return (
    <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold">Gate Heat Map</h2>

        <div className="flex gap-3 text-xs">
          <Legend
            color={trafficSettings.colors.light}
            label={`Light (0-${mediumThreshold - 1})`}
          />

          <Legend
            color={trafficSettings.colors.medium}
            label={`Medium (${mediumThreshold}-${trafficSettings.heavy - 1})`}
          />

          <Legend
            color={trafficSettings.colors.heavy}
            label={`Heavy (${trafficSettings.heavy}+)`}
          />
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative h-[420px] rounded-xl overflow-hidden border border-border"
        style={
          mapImage
            ? {
                backgroundImage: `url(${mapImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {!mapImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
        )}

        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full grid grid-cols-10 grid-rows-6">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="border border-border" />
            ))}
          </div>
        </div>

        {isDragging && dragPosition && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: `${dragPosition.x}%`,
              top: `${dragPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand bg-blue-400/20 animate-pulse flex items-center justify-center">
              <span className="text-brand text-xs font-bold">DROP</span>
            </div>
          </div>
        )}

        {gates.map((gate) => {
          const position = gatePositions[gate.id];

          const x = position?.x ?? gate.x ?? 50;

          const y = position?.y ?? gate.y ?? 50;

          const entryCount = gate.entryCount || 0;

          const level = getCongestionLevel(entryCount);

          const isOpen = gate.isOpen || false;

          const isBeingDragged = draggedGate?.id === gate.id && isDragging;

          return (
            <div
              key={gate.id}
              onPointerDown={(e) => onPointerDown(e, String(gate.id))}
              onPointerMove={(e) => onPointerMove(e, String(gate.id))}
              onClick={() => onSelectGate(gate)}
              className="absolute cursor-grab active:cursor-grabbing touch-none select-none group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: selectedGate?.id === gate.id ? 30 : 20,
                opacity: isBeingDragged ? 0.5 : 1,
              }}
            >
              <div className="relative flex flex-col items-center">
                <Gate open={isOpen} size="sm" />

                <span className="text-[8px] text-muted-foreground mt-1">
                  {gate.name}
                </span>

                <div
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-foreground ${
                    level === "heavy"
                      ? "bg-danger"
                      : level === "medium"
                        ? "bg-warn"
                        : "bg-ok"
                  }`}
                >
                  {entryCount}
                </div>

                {selectedGate?.id === gate.id && (
                  <div className="absolute -inset-2 rounded-xl border-2 border-brand pointer-events-none" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
