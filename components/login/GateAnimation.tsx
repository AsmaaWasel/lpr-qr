
"use client";

type GateAnimationProps = {
  gateStatus: "idle" | "opening" | "error";
};

export default function GateAnimation({ gateStatus }: GateAnimationProps) {
  return (
    <div className="relative">
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-700 ${
          gateStatus === "opening"
            ? "bg-emerald-400/40 scale-125 blur-md"
            : gateStatus === "error"
              ? "bg-red-500/40 scale-110 blur-sm animate-bounce"
              : "bg-sky-400/20 animate-ping"
        }`}
      />

      <div
        className={`relative flex h-28 w-40 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-500 ${
          gateStatus === "opening"
            ? "border-emerald-500/50 bg-emerald-950/50 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            : gateStatus === "error"
              ? "border-red-500/50 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-headShake"
              : "border-sky-400/30 bg-sky-950/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        }`}
      >
        <div className="relative flex h-14 w-28 items-end justify-between px-2">
          <div
            className={`h-10 w-2.5 rounded-t transition-colors duration-500 ${
              gateStatus === "opening"
                ? "bg-emerald-400"
                : gateStatus === "error"
                  ? "bg-red-400"
                  : "bg-sky-400"
            }`}
          />
          <div
            className={`absolute bottom-7 left-[16px] h-2 w-20 rounded-full transition-all duration-[800ms] ease-in-out origin-left ${
              gateStatus === "opening"
                ? "-rotate-90 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]"
                : gateStatus === "error"
                  ? "rotate-0 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  : "rotate-0 bg-gradient-to-r from-sky-400 via-orange-500 to-sky-400"
            }`}
          />
          <div className="h-6 w-2.5 bg-slate-600 rounded-t opacity-40" />
        </div>
      </div>
    </div>
  );
}
