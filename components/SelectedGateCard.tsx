// components/SelectedGateCard.tsx
"use client";

import { useState } from "react";
import {
  HiOutlineVideoCamera,
  HiOutlineLockOpen,
  HiOutlineRefresh,
} from "react-icons/hi";
import Gate from "@/modules/sharedComponents/gate-entries/Gate";
import CameraStreamModal from "./CameraStreamModal";

type GateData = {
  id: number;
  name: string;
  desc: string;
  isOpen?: boolean;
  entryCount?: number;
  gateId?: string;
  controller?: string;
  camera?: string;
  trafficLevel?: "LIGHT" | "MEDIUM" | "HEAVY";
};

type SelectedGateCardProps = {
  gate: GateData | null;
  gateOpen: boolean;
  status: "idle" | "granted" | "denied";
  gateLoading: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRefresh?: () => void;
};

export default function SelectedGateCard({
  gate,
  gateOpen,
  status,
  gateLoading,
  onOpen,
  onClose,
  onRefresh,
}: SelectedGateCardProps) {
  const [isStreamOpen, setIsStreamOpen] = useState(false);

  if (!gate) {
    return (
      <div className="bg-gradient-to-br from-[#0B1B30] to-[#16324F] rounded-2xl border border-[#16324F] p-6">
        <p className="text-muted-foreground text-center">Select a gate</p>
      </div>
    );
  }

  const trafficLevel = gate.trafficLevel || "LIGHT";
  const trafficColors = {
    LIGHT: "text-emerald-400",
    MEDIUM: "text-amber-400",
    HEAVY: "text-rose-400",
  };

  const trafficBgColors = {
    LIGHT: "bg-emerald-400/10 border-emerald-400/20",
    MEDIUM: "bg-amber-400/10 border-amber-400/20",
    HEAVY: "bg-rose-400/10 border-rose-400/20",
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#0B1B30] to-[#16324F] rounded-2xl border border-[#16324F] p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Selected Gate
            </p>
            <h2 className="text-lg font-bold text-white">
              {gate.name} ·{" "}
              {gate.desc?.split("·")[0]?.trim() || gate.desc || "Main"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {gate.desc || "No description"}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-semibold ${gateOpen ? "text-emerald-400" : "text-muted-foreground"}`}
            >
              {gateOpen ? "OPEN" : "CLOSED"}
            </span>
            <div className="text-sm text-muted-foreground">
              {status === "idle" && "STANDING BY"}
              {status === "granted" && "GRANTED"}
              {status === "denied" && "DENIED"}
            </div>
          </div>
        </div>

        {/* Gate Animation */}
        <div className="bg-[#16324F] rounded-xl p-4 flex flex-col items-center border border-[#1a3d5f]">
          <Gate open={gateOpen} size="md" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#16324F]/50 rounded-lg p-3 border border-[#1a3d5f]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Gate ID
            </p>
            <p className="text-sm font-semibold text-white">
              {gate.gateId || `GT-${String(gate.id).padStart(3, "0")}`}
            </p>
          </div>
          <div className="bg-[#16324F]/50 rounded-lg p-3 border border-[#1a3d5f]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Controller
            </p>
            <p className="text-sm font-semibold text-white">
              {gate.controller || "10.20.1.11"}
            </p>
          </div>
          <div className="bg-[#16324F]/50 rounded-lg p-3 border border-[#1a3d5f]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Camera
            </p>
            <p className="text-sm font-semibold text-white">
              {gate.camera || "CAM-01"}
            </p>
          </div>
          <div className="bg-[#16324F]/50 rounded-lg p-3 border border-[#1a3d5f]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Entries Today
            </p>
            <p className="text-sm font-semibold text-white">
              {gate.entryCount || 0}
            </p>
          </div>
        </div>

        {/* Traffic */}
        <div className="mt-4 bg-[#16324F]/50 rounded-lg p-3 border border-[#1a3d5f] flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Traffic
          </span>
          <span
            className={`text-sm font-semibold ${trafficColors[trafficLevel]} px-3 py-1 rounded-full ${trafficBgColors[trafficLevel]} border`}
          >
            {trafficLevel}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            disabled={!gate || gateLoading}
            onClick={onOpen}
            className="flex-1 bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 py-2.5 rounded-xl hover:bg-emerald-400/30 transition-all disabled:opacity-50 font-medium flex items-center justify-center gap-2 text-sm"
          >
            <HiOutlineLockOpen className="w-4 h-4" />
            {gateLoading ? "..." : "Open Gate"}
          </button>

          <button
            disabled={!gate || gateLoading}
            onClick={() => setIsStreamOpen(true)}
            className="flex-1 bg-blue-500/15 text-blue-400 border border-blue-400/30 py-2.5 rounded-xl hover:bg-blue-500/30 transition-all disabled:opacity-50 font-medium flex items-center justify-center gap-2 text-sm"
          >
            <HiOutlineVideoCamera className="w-4 h-4" />
            Feed
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="bg-slate-500/15 text-muted-foreground border border-slate-500/30 p-2.5 rounded-xl hover:bg-slate-500/30 transition-all"
            >
              <HiOutlineRefresh className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Camera Stream Modal */}
      <CameraStreamModal
        isOpen={isStreamOpen}
        onClose={() => setIsStreamOpen(false)}
        gate={gate}
      />
    </>
  );
}
