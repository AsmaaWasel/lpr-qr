// components/CameraStreamModal.tsx
"use client";

import { useState } from "react";
import {
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi";

type GateData = {
  id: number;
  name: string;
  desc: string;
  camera?: string;
  controller?: string;
};

type DetectionLog = {
  plate: string;
  time: string;
  gate: string;
  status: "ALLOWED" | "DENIED";
};

type CameraStreamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  gate: GateData | null;
};

export default function CameraStreamModal({
  isOpen,
  onClose,
  gate,
}: CameraStreamModalProps) {
  const [lprStatus, setLprStatus] = useState<
    "idle" | "detecting" | "registered" | "clear"
  >("idle");
  const [plateNumber, setPlateNumber] = useState<string>("—");
  const [resident, setResident] = useState<string>("—");
  const [matchStatus, setMatchStatus] = useState<string>("—");
  const [isDetecting, setIsDetecting] = useState(false);

  const [detectionLogs] = useState<DetectionLog[]>([
    { plate: "ا ب خ 123", time: "14:52", gate: "Gate-1", status: "ALLOWED" },
    { plate: "ر ن 552", time: "14:44", gate: "Gate-3", status: "DENIED" },
    { plate: "ط ح 881", time: "14:22", gate: "Gate-3", status: "ALLOWED" },
  ]);

  if (!isOpen || !gate) return null;

  const cameraName = gate.camera || "CAM-01";
  const controllerIp = gate.controller || "10.20.1.11";

  const handleDetectLPR = () => {
    setIsDetecting(true);
    setLprStatus("detecting");

    setTimeout(() => {
      const mockPlate = "ا ب خ 123";
      const mockResident = "Ahmed Mohamed";
      const mockMatch = "✅ MATCH";

      setPlateNumber(mockPlate);
      setResident(mockResident);
      setMatchStatus(mockMatch);
      setLprStatus("registered");
      setIsDetecting(false);
    }, 2000);
  };

  const handleClear = () => {
    setPlateNumber("—");
    setResident("—");
    setMatchStatus("—");
    setLprStatus("clear");
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-gradient-to-br from-[#0B1B30] to-[#16324F] rounded-2xl border border-[#1a3d5f] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a3d5f]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">📹</span>
              Camera stream · {cameraName}
            </h2>
            <p className="text-sm text-muted-foreground">
              rtsp://{controllerIp}:554 · 1080p
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-[#1a3d5f] rounded-lg"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* LPR Controls */}
          <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  Detect LPR
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {lprStatus === "idle" && "IDLE"}
                  {lprStatus === "detecting" && "DETECTING..."}
                  {lprStatus === "registered" && "REGISTERED"}
                  {lprStatus === "clear" && "CLEAR"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDetectLPR}
                  disabled={isDetecting}
                  className="px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 text-sm font-medium"
                >
                  {isDetecting ? "..." : "Detect"}
                </button>
                <button
                  onClick={handleClear}
                  disabled={isDetecting}
                  className="px-4 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-400/30 rounded-lg hover:bg-rose-500/30 transition-all disabled:opacity-50 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {lprStatus === "idle" && (
                <>
                  <HiOutlineClock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Waiting for detection
                  </span>
                </>
              )}
              {lprStatus === "detecting" && (
                <>
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-400">Detecting plate...</span>
                </>
              )}
              {lprStatus === "registered" && (
                <>
                  <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">
                    Plate registered successfully
                  </span>
                </>
              )}
              {lprStatus === "clear" && (
                <>
                  <HiOutlineXCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">Cleared</span>
                </>
              )}
            </div>
          </div>

          {/* Detection Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                PLATE
              </p>
              <p className="text-lg font-bold text-white font-mono">
                {plateNumber}
              </p>
            </div>
            <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                RESIDENT
              </p>
              <p className="text-lg font-bold text-white">{resident}</p>
            </div>
            <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                GATE
              </p>
              <p className="text-lg font-bold text-white">{gate.name}</p>
            </div>
            <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                MATCH
              </p>
              <p
                className={`text-lg font-bold ${matchStatus.includes("MATCH") ? "text-emerald-400" : "text-muted-foreground"}`}
              >
                {matchStatus}
              </p>
            </div>
          </div>

          {/* Detection Log */}
          <div className="bg-[#16324F] rounded-xl p-4 border border-[#1a3d5f]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Detection log
            </p>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {detectionLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-[#1a3d5f]/50 last:border-0"
                >
                  <span className="font-mono text-white">{log.plate}</span>
                  <span className="text-muted-foreground">{log.time}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{log.gate}</span>
                  <span
                    className={`font-semibold ${log.status === "ALLOWED" ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
