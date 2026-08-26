"use client";


import {
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

type GatePosition = {
  x: number;
  y: number;
};

type TrafficSettings = {
  light: number;
  heavy: number;
  colors: {
    light: string;
    medium: string;
    heavy: string;
  };
};

type Gate = {
  id: number;
  name: string;
  desc?: string;
  x?: number;
  y?: number;
  isOpen?: boolean;
  entryCount?: number;
  queueCount?: number;
};

type CongestionLevel = "light" | "medium" | "heavy";

type GateStatus = "idle" | "granted" | "denied";

type Log = {
  message: string;
  queueCount: number;
  timeDate: string;
  gateName: string;
  level: CongestionLevel;
  isOpen: boolean;
};

type Props = {
  gates: Gate[];

  selectedGate: Gate | null;

  gatePositions: Record<number, GatePosition>;

  trafficSettings: TrafficSettings;

  mediumThreshold: number;

  mapImage: string | null;

  isDragging: boolean;

  dragPosition: { x: number; y: number } | null;

  draggedGate: Gate | null;

  mapRef: React.RefObject<HTMLDivElement | null>;

  gateOpen: boolean;

  gateLoading: boolean;

  status: GateStatus;

  logs: Log[];

  getCongestionLevelByEntryCount: (count: number) => CongestionLevel;

  getLevelColorByEntryCount: (count: number) => string;

  getLevelTextColor: (level: CongestionLevel) => string;

  getLevelLabel: (level: CongestionLevel) => string;

  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;

  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;

  handleGatePointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    gateId: string,
  ) => void;

  handleGatePointerMove: (
    e: React.PointerEvent<HTMLDivElement>,
    gateId: string,
  ) => void;

  handleGateSelect: (gate: Gate) => void;

  handleDragStart: (e: React.DragEvent<HTMLButtonElement>, gate: Gate) => void;

  openGate: (id: number) => Promise<void>;

  closeGate: (id: number) => Promise<void>;

  updateGateStatus: (id: number, isOpen: boolean) => void;

  setGateOpen: React.Dispatch<React.SetStateAction<boolean>>;

  setGateLoading: React.Dispatch<React.SetStateAction<boolean>>;

  setLogs: React.Dispatch<React.SetStateAction<Log[]>>;

  formatTimeDate: () => string;
};

export default function LiveDemoGrid({
  gates,
  selectedGate,
  gatePositions,
  trafficSettings,
  mediumThreshold,
  mapImage,
  isDragging,
  dragPosition,
  draggedGate,
  mapRef,
  gateOpen,
  gateLoading,
  status,
  getCongestionLevelByEntryCount,
  getLevelColorByEntryCount,
  getLevelTextColor,
  getLevelLabel,
  handleDragOver,
  handleDrop,
  handleGatePointerDown,
  handleGatePointerMove,
  handleGateSelect,
  handleDragStart,
  openGate,
  closeGate,
  updateGateStatus,
  setGateOpen,
  setGateLoading,
  setLogs,
  formatTimeDate,
}: Props) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* =====================================================
          LEFT — HEAT MAP
      ====================================================== */}

      <div className="col-span-8">
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground font-bold">Gate Heat Map</h2>

            <div className="flex gap-4 text-xs">
              {/* Light */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: trafficSettings.colors.light,
                  }}
                />

                <span className="text-muted-foreground text-sm">
                  Light (0-{mediumThreshold - 1})
                </span>
              </div>

              {/* Medium */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: trafficSettings.colors.medium,
                  }}
                />

                <span className="text-muted-foreground text-sm">
                  Medium ({mediumThreshold}-{trafficSettings.heavy - 1})
                </span>
              </div>

              {/* Heavy */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: trafficSettings.colors.heavy,
                  }}
                />

                <span className="text-muted-foreground text-sm">
                  Heavy ({trafficSettings.heavy}+)
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div
            ref={mapRef}
            className="relative h-[600px] rounded-xl overflow-hidden border border-border"
            style={
              mapImage
                ? {
                    backgroundImage: `url(${mapImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!mapImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
            )}

            {mapImage && <div className="absolute inset-0 bg-slate-900/30" />}

            {/* Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full grid grid-cols-10 grid-rows-6">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="border border-border" />
                ))}
              </div>
            </div>

            {/* Drop Indicator */}
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

            {/* Gates */}
            {gates.map((gate) => {
              const position = gatePositions[gate.id];

              const x = position?.x ?? gate.x ?? 50;
              const y = position?.y ?? gate.y ?? 50;

              const entryCount = gate.entryCount || 0;

              const level = getCongestionLevelByEntryCount(entryCount);

              const isOpen = gate.isOpen || false;

              const isSelected = selectedGate?.id === gate.id;

              const isBeingDragged = draggedGate?.id === gate.id && isDragging;

              return (
                <div
                  key={gate.id}
                  onPointerDown={(e) =>
                    handleGatePointerDown(e, String(gate.id))
                  }
                  onPointerMove={(e) =>
                    handleGatePointerMove(e, String(gate.id))
                  }
                  onClick={() => handleGateSelect(gate)}
                  className="absolute cursor-grab active:cursor-grabbing touch-none select-none group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isSelected ? 30 : 20,
                    opacity: isBeingDragged ? 0.5 : 1,
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
                    // eslint-disable-next-line react/jsx-no-undef
                    <GateIcon open={isOpen} size="sm" />

                    {/* Name */}
                    <span className="text-[10px] text-muted-foreground mt-1 font-medium whitespace-nowrap">
                      {gate.name.length > 8
                        ? `${gate.name.substring(0, 8)}..`
                        : gate.name}
                    </span>

                    {/* Traffic Badge */}
                    <div
                      className={`
                        absolute
                        -top-2
                        -right-2
                        w-5
                        h-5
                        rounded-full
                        border
                        border-border
                        flex
                        items-center
                        justify-center
                        text-[8px]
                        font-bold
                        text-foreground
                        ${getLevelColorByEntryCount(entryCount)}
                      `}
                    >
                      {entryCount}
                    </div>

                    {/* Selected Border */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-xl border-2 border-brand pointer-events-none" />
                    )}

                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg border border-border px-2 py-1 shadow-xl">
                        <span className="text-white text-[10px] font-bold">
                          {gate.name}
                        </span>

                        <span
                          className={`
                            text-[10px]
                            ml-1
                            ${getLevelTextColor(level)}
                          `}
                        >
                          ({entryCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Map */}
            {!isDragging && gates.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">↕</div>

                  <p className="text-sm">Drag gates from table to map</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="col-span-4 space-y-6">
        {/* =================================================
            ALL GATES
        ================================================== */}

        <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-5">
          <h3 className="text-foreground font-bold text-lg mb-4 flex items-center gap-2">
            <HiOutlineOfficeBuilding className="w-4 h-4" />
            All Gates
            <span className="text-sm text-muted-foreground font-normal ml-1">
              (Drag to map)
            </span>
          </h3>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {gates.map((gate) => (
              <button
                key={gate.id}
                onClick={() => handleGateSelect(gate)}
                draggable
                onDragStart={(e) => handleDragStart(e, gate)}
                className={`
                  w-full
                  text-left
                  p-3
                  rounded-xl
                  transition-all
                  duration-200
                  cursor-grab
                  active:cursor-grabbing
                  ${
                    selectedGate?.id === gate.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground border border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:scale-[1.02]"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{gate.name}</span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        w-2
                        h-2
                        rounded-full
                        ${getLevelColorByEntryCount(gate.entryCount || 0)}
                      `}
                    />

                    <span className="text-xs text-muted-foreground">
                      {gate.entryCount || 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* =================================================
            SELECTED GATE
        ================================================== */}

        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm">Selected Gate</p>

              <h2 className="text-xl font-bold text-foreground">
                {selectedGate?.name || "No Gate"}
              </h2>

              <p className="text-muted-foreground text-sm">
                {selectedGate?.desc || "Select a gate from the map"}
              </p>
            </div>

            {selectedGate && (
              <div className="text-right space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Traffic:</span>{" "}
                  <span
                    className={`
                      font-semibold
                      ${getLevelTextColor(
                        getCongestionLevelByEntryCount(
                          selectedGate.entryCount || 0,
                        ),
                      )}
                    `}
                  >
                    {getLevelLabel(
                      getCongestionLevelByEntryCount(
                        selectedGate.entryCount || 0,
                      ),
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Gate Status */}
          <div className="bg-slate-800/30 rounded-xl p-4 flex flex-col items-center border border-border">
            <GateIcon open={gateOpen} size="md" />

            <div className="mt-3 text-center">
              {status === "idle" && (
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <HiOutlineClock className="w-4 h-4" />
                  Waiting for plate...
                </p>
              )}

              {status === "granted" && (
                <div className="flex items-center gap-3">
                  <HiOutlineCheckCircle className="w-6 h-6 text-ok" />

                  <h2 className="text-xl font-bold text-ok">GRANTED</h2>
                </div>
              )}

              {status === "denied" && (
                <div className="flex items-center gap-3">
                  <HiOutlineXCircle className="w-6 h-6 text-rose-400" />

                  <h2 className="text-xl font-bold text-rose-400">DENIED</h2>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-3 flex gap-2">
            {/* Open */}
            <button
              disabled={!selectedGate || gateLoading}
              onClick={async () => {
                if (!selectedGate) return;

                try {
                  setGateLoading(true);

                  await openGate(selectedGate.id);

                  setGateOpen(true);

                  updateGateStatus(selectedGate.id, true);

                  setLogs((prev) => [
                    {
                      message: `Gate ${selectedGate.name} opened manually`,
                      queueCount: selectedGate.queueCount || 0,
                      timeDate: formatTimeDate(),
                      gateName: selectedGate.name,
                      level: getCongestionLevelByEntryCount(
                        selectedGate.queueCount || 0,
                      ),
                      isOpen: true,
                    },
                    ...prev,
                  ]);
                } catch (error) {
                  console.error(error);
                } finally {
                  setGateLoading(false);
                }
              }}
              className="
                flex-1
                bg-ok/15
                text-ok
                border
                border-emerald-500/30
                py-2
                rounded-xl
                hover:bg-emerald-500/30
                transition-all
                disabled:opacity-50
                font-medium
                flex
                items-center
                justify-center
                gap-2
                text-sm
              "
            >
              <span>🔓</span>

              {gateLoading ? "..." : "Open"}
            </button>

            {/* Close */}
            <button
              disabled={!selectedGate || gateLoading}
              onClick={async () => {
                if (!selectedGate) return;

                try {
                  setGateLoading(true);

                  await closeGate(selectedGate.id);

                  setGateOpen(false);

                  updateGateStatus(selectedGate.id, false);

                  setLogs((prev) => [
                    {
                      message: `Gate ${selectedGate.name} closed manually`,
                      queueCount: selectedGate.queueCount || 0,
                      timeDate: formatTimeDate(),
                      gateName: selectedGate.name,
                      level: getCongestionLevelByEntryCount(
                        selectedGate.queueCount || 0,
                      ),
                      isOpen: false,
                    },
                    ...prev,
                  ]);
                } catch (error) {
                  console.error(error);
                } finally {
                  setGateLoading(false);
                }
              }}
              className="
                flex-1
                bg-rose-500/20
                text-rose-400
                border
                border-rose-500/30
                py-2
                rounded-xl
                hover:bg-rose-500/30
                transition-all
                disabled:opacity-50
                font-medium
                flex
                items-center
                justify-center
                gap-2
                text-sm
              "
            >
              <span>🔒</span>

              {gateLoading ? "..." : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
