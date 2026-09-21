"use client";

import {
  HiOutlineMap,
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";

import GateVisual from "@/modules/sharedComponents/gate-entries/Gate";

type CongestionLevel = "light" | "medium" | "heavy";

export type GateStatus = "closed" | "opening" | "open" | "closing";

type Gate = {
  id: number;
  name: string;
  desc?: string | null;
  x?: number;
  y?: number;
  isOpen?: boolean;
  status?: GateStatus;
  queueCount?: number;
  entryCount?: number;
};

type Position = {
  x: number;
  y: number;
};

type GateMapProps = {
  open: boolean;
  onClose: () => void;
  gates: Gate[];
  mapImage: string | null;
  gatePositions: Record<string, Position>;
  getCongestionLevelByEntryCount: (entryCount: number) => CongestionLevel;
  getLevelTextColor: (level: CongestionLevel) => string;
  onGateSelect: (gate: Gate) => void;

  onDragStart: (e: React.DragEvent, gate: Gate) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;

  onPointerDown: (e: React.PointerEvent, gateId: string) => void;

  onPointerMove: (e: React.PointerEvent, gateId: string) => void;

  onPointerUp: () => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  isDragging: boolean;
  draggedGate: Gate | null;
  dragPosition: Position | null;

  uploadingImage: boolean;
  uploadError: string | null;

  fileInputRef: React.RefObject<HTMLInputElement | null>;

  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onRemoveImage: () => void;
};

export default function GateMap({
  open,
  onClose,
  gates,
  mapImage,
  gatePositions,
  getCongestionLevelByEntryCount,
  getLevelTextColor,
  onGateSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  mapRef,
  isDragging,
  draggedGate,
  dragPosition,
  uploadingImage,
  uploadError,
  fileInputRef,
  onImageUpload,
  onRemoveImage,
}: GateMapProps) {
  return (
    <>
      {/* ===================================================== */}
      {/* HEAT MAP */}
      {/* ===================================================== */}

      <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground font-bold">Gate Heat Map</h2>

          <div className="text-xs text-muted-foreground">
            Drag gates to reposition
          </div>
        </div>

        {/* ===================================================== */}
        {/* MAP */}
        {/* ===================================================== */}

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
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* BACKGROUND */}

          {!mapImage && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
          )}

          {mapImage && <div className="absolute inset-0 bg-slate-900/30" />}

          {/* GRID */}

          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full grid grid-cols-10 grid-rows-6">
              {Array.from({ length: 60 }).map((_, index) => (
                <div key={index} className="border border-border" />
              ))}
            </div>
          </div>

          {/* ================================================= */}
          {/* DROP POSITION */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* GATES */}
          {/* ================================================= */}

          {gates.map((gate) => {
            const position = gatePositions[String(gate.id)];

            const x = position?.x ?? gate.x ?? 50;
            const y = position?.y ?? gate.y ?? 50;

            const entryCount = gate.entryCount || 0;

            const level = getCongestionLevelByEntryCount(entryCount);

            const status: GateStatus =
              gate.status ?? (gate.isOpen ? "open" : "closed");

            const isOpen = status === "open" || status === "opening";

            const isMoving = status === "opening" || status === "closing";

            const isBeingDragged = draggedGate?.id === gate.id && isDragging;

            return (
              <div
                key={gate.id}
                onPointerDown={(e) => onPointerDown(e, String(gate.id))}
                onPointerMove={(e) => onPointerMove(e, String(gate.id))}
                onPointerUp={onPointerUp}
                onClick={() => onGateSelect(gate)}
                className="absolute cursor-grab active:cursor-grabbing touch-none select-none group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: draggedGate?.id === gate.id ? 50 : 20,
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
                    ${
                      draggedGate?.id === gate.id
                        ? "scale-110"
                        : "hover:scale-105"
                    }
                  `}
                >
                  {/* ================================================= */}
                  {/* REAL GATE */}
                  {/* ================================================= */}

                  <div className="relative w-[90px] h-[90px] flex items-center justify-center">
                    {/* 
                      GateVisual contains the ONLY barrier arm.
                      No extra arm is rendered here.
                    */}

                    <div className="relative z-20">
                      <GateVisual open={isOpen} size="sm" />
                    </div>

                    {/* ================================================= */}
                    {/* GLOW */}
                    {/* ================================================= */}

                    {isMoving && (
                      <div
                        className={`
                          absolute
                          -inset-4
                          rounded-full
                          pointer-events-none
                          animate-pulse
                          bg-amber-400/20
                        `}
                      />
                    )}

                    {status === "open" && (
                      <div className="absolute -inset-5 rounded-full bg-emerald-400/10 animate-pulse pointer-events-none" />
                    )}
                  </div>

                  {/* ================================================= */}
                  {/* STATUS */}
                  {/* ================================================= */}

                  <div className="mt-1 flex flex-col items-center">
                    <span className="text-[8px] text-muted-foreground font-medium whitespace-nowrap">
                      {gate.name.length > 8
                        ? `${gate.name.substring(0, 8)}..`
                        : gate.name}
                    </span>

                    <span
                      className={`
                        text-[7px]
                        font-bold
                        uppercase
                        ${
                          status === "open"
                            ? "text-emerald-400"
                            : status === "opening"
                              ? "text-amber-400"
                              : status === "closing"
                                ? "text-amber-400"
                                : "text-rose-400"
                        }
                      `}
                    >
                      {status}
                    </span>
                  </div>

                  {/* ================================================= */}
                  {/* CONGESTION */}
                  {/* ================================================= */}

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
                      ${
                        level === "heavy"
                          ? "bg-danger"
                          : level === "medium"
                            ? "bg-warn"
                            : "bg-ok"
                      }
                    `}
                  >
                    {entryCount}
                  </div>

                  {/* ================================================= */}
                  {/* SELECTED */}
                  {/* ================================================= */}

                  <div
                    className={`
                      absolute
                      -inset-2
                      rounded-xl
                      border-2
                      border-brand
                      pointer-events-none
                      ${draggedGate?.id === gate.id ? "opacity-0" : ""}
                    `}
                  />

                  {/* ================================================= */}
                  {/* TOOLTIP */}
                  {/* ================================================= */}

                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg border border-border px-3 py-2 shadow-xl">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground text-[10px] font-bold">
                          {gate.name}
                        </span>

                        <span
                          className={`
                            text-[9px] font-semibold
                            ${
                              status === "open"
                                ? "text-emerald-400"
                                : status === "opening"
                                  ? "text-amber-400"
                                  : status === "closing"
                                    ? "text-amber-400"
                                    : "text-rose-400"
                            }
                          `}
                        >
                          Gate:{" "}
                          {status
                            .replace("opening", "Opening")
                            .replace("closing", "Closing")
                            .replace("open", "Open")
                            .replace("closed", "Closed")}
                        </span>

                        <span
                          className={`text-[9px] ${getLevelTextColor(level)}`}
                        >
                          Traffic: {entryCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ================================================= */}
          {/* EMPTY */}
          {/* ================================================= */}

          {!isDragging && gates.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">↕</div>

                <p className="text-lg">Drag gates from table to map</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* MAP MODAL */}
      {/* ===================================================== */}

      {open && (
        <div className="fixed inset-0 flex items-start justify-end p-6 z-50 pointer-events-none">
          <div className="bg-secondary rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl pointer-events-auto">
            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <HiOutlineMap className="w-5 h-5 text-brand" />
                  Map
                </h2>

                <p className="text-muted-foreground text-xs mt-1">
                  Upload the background map
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* LABEL */}

              <label className="text-foreground text-lg font-semibold flex items-center gap-2">
                <HiOutlinePhotograph className="w-4 h-4" />
                Map Background
              </label>

              {/* FILE */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                disabled={uploadingImage}
                className="w-full text-muted-foreground text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-brand cursor-pointer"
              />

              {/* ERROR */}

              {uploadError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                  <p className="text-rose-400 text-lg">{uploadError}</p>
                </div>
              )}

              {/* PREVIEW */}

              {mapImage && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                  <img
                    src={mapImage}
                    alt="Map preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={onRemoveImage}
                    disabled={uploadingImage}
                    className="absolute top-2 right-2 p-2 bg-rose-500/80 hover:bg-danger rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              )}

              {/* LOADING */}

              {uploadingImage && (
                <p className="text-brand text-sm">Uploading image...</p>
              )}

              {/* DONE */}

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-blue-500/20 text-brand border border-blue-500/30 py-3 rounded-xl hover:bg-blue-500/30 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
