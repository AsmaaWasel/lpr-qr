"use client";

import { useState } from "react";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

import Gate from "@/modules/sharedComponents/gate-entries/Gate";

import { openGate, closeGate } from "@/services/access-control";
import { CongestionLevel, GateData } from "@/modules/types/gateEntry";

type Props = {
  selectedGate: GateData | null;

  getCongestionLevel: (count: number) => CongestionLevel;

  onGateStatusChange: (gateId: number, isOpen: boolean) => void;
};

export default function GateControl({
  selectedGate,
  getCongestionLevel,
  onGateStatusChange,
}: Props) {
  const [gateOpen, setGateOpen] = useState(false);

  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (!selectedGate) return;

    try {
      setLoading(true);

      await openGate(selectedGate.id);

      setGateOpen(true);
      setStatus("granted");

      onGateStatusChange(selectedGate.id, true);
    } catch (error) {
      console.error(error);
      setStatus("denied");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!selectedGate) return;

    try {
      setLoading(true);

      await closeGate(selectedGate.id);

      setGateOpen(false);

      onGateStatusChange(selectedGate.id, false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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

          {selectedGate && (
            <p className="text-xs text-muted-foreground mt-1">
              Entries: {selectedGate.entryCount || 0}
            </p>
          )}
        </div>

        {selectedGate && (
          <div>
            <span className="text-muted-foreground">Traffic: </span>

            <span className="text-ok font-semibold">
              {getCongestionLevel(selectedGate.entryCount || 0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 rounded-xl p-8 flex flex-col items-center">
        <Gate open={gateOpen} size="lg" />

        <div className="mt-6">
          {status === "idle" && (
            <p className="text-muted-foreground flex items-center gap-2">
              <HiOutlineClock />
              Waiting for plate detection...
            </p>
          )}

          {status === "granted" && (
            <div className="flex items-center gap-3 text-ok">
              <HiOutlineCheckCircle className="w-8 h-8" />

              <h2 className="text-xl font-bold">ACCESS GRANTED</h2>
            </div>
          )}

          {status === "denied" && (
            <div className="flex items-center gap-3 text-rose-400">
              <HiOutlineXCircle className="w-8 h-8" />

              <h2 className="text-xl font-bold">ACCESS DENIED</h2>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          disabled={!selectedGate || loading}
          onClick={handleOpen}
          className="flex-1 bg-ok/15 text-ok border border-emerald-500/30 py-3 rounded-xl"
        >
          🔓 {loading ? "Loading..." : "Open Gate"}
        </button>

        <button
          disabled={!selectedGate || loading}
          onClick={handleClose}
          className="flex-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 py-3 rounded-xl"
        >
          🔒 {loading ? "Loading..." : "Close Gate"}
        </button>
      </div>
    </div>
  );
}
