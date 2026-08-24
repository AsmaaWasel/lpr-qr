"use client";

interface GateProps {
  open: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Gate({ open, size = "md" }: GateProps) {
  const sizes = {
    sm: {
      pillar: "w-4 h-13", // Made shorter
      arm: "w-16 h-1.5", // Shorter arm
      joint: "w-2.5 h-2.5",
      light: "w-2.5 h-2.5",
    },
    md: {
      pillar: "w-5 h-40",
      arm: "w-40 h-3",
      joint: "w-4 h-4",
      light: "w-4 h-4",
    },
    lg: {
      pillar: "w-8 h-60",
      arm: "w-64 h-4",
      joint: "w-5 h-5",
      light: "w-5 h-5",
    },
  };

  const s = sizes[size];

  return (
    <div className="relative flex items-end justify-center">
      {/* Pole */}
      <div
        className={`
          ${s.pillar}
          relative
          rounded-lg
          bg-gradient-to-b
          from-slate-300
          via-slate-500
          to-slate-800
          shadow-2xl
        `}
      >
        {/* Signal Light */}
        <div
          className={`
            absolute top-2 right-1/2 translate-x-1/2
            ${s.light}
            rounded-full
            transition-all duration-500
            ${
              open
                ? "bg-emerald-400 shadow-[0_0_20px_#34d399]"
                : "bg-danger shadow-[0_0_20px_#ef4444]"
            }
          `}
        />

        {/* Gate Arm - Shorter and positioned higher */}
        <div
          className={`
            absolute
            left-1/2
            top-3
            ${s.arm}
            origin-left
            rounded-full
            transition-all duration-700
            ${open ? "-rotate-60 bg-emerald-400" : "rotate-0 bg-danger"}
          `}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-white/30 via-transparent to-white/30" />
        </div>

        {/* Joint - Top */}
        <div
          className={`
            absolute
            left-1/2
            top-2.5
            -translate-x-1/2
            ${s.joint}
            rounded-full
            bg-slate-700
            border-2 border-slate-400
          `}
        />

        {/* Joint - Bottom */}
        <div
          className={`
            absolute left-1/2 bottom-4
            -translate-x-1/2
            ${s.joint}
            rounded-full
            bg-slate-700
            border-2 border-slate-400
          `}
        />
      </div>
    </div>
  );
}
