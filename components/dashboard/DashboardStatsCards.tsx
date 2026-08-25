"use client";

import {
  Users,
  BarChart3,
  CarFront,
  Zap,
  ShieldCheck,
  Crosshair,
} from "lucide-react";

export default function DashboardStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ================= CARD 1 ================= */}
      <div
        className="
          relative
          min-h-[190px]
          overflow-hidden
          rounded-[20px]
          p-6
          shadow-sm
        "
        style={{
          background: "linear-gradient(165deg, #16324F, #0B1B30)",
        }}
      >
        {/* Left Icon */}
        <div className="absolute left-5 top-5">
          <div
            className="
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-xl
    bg-[#29C5E829]
    text-[#29C5E8]
  "
          >
            <Users className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>

        {/* Right Icon */}
        <div className="absolute right-5 top-5">
          <div
            className="
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-xl
      bg-[#29C5E829]
      text-[#29C5E8]
      text-[11px]
      font-[600]
      whitespace-nowrap
    "
          >
            +12%
          </div>
        </div>
        {/* Content */}
        <div className="relative z-10 mt-20">
          <h2
            className="
              text-[36px]
              font-[700]
              leading-none
              tracking-tight
              text-white
            "
          >
            1,284
          </h2>

          <p
            className="
              mt-3
              text-[13px]
              font-[600]
              tracking-wide
              text-[#7C93B4]
            "
          >
            TOTAL DAILY ACCESSES
          </p>
        </div>
      </div>

      {/* ================= CARD 2 ================= */}
      <div
        className="
    relative
    min-h-[190px]
    overflow-hidden
    rounded-[20px]
    bg-white
    p-6
    shadow-sm
    dark:bg-slate-900
  "
      >
        {/* Left Icon */}
        <div className="absolute left-5 top-5">
          <div
            className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-[#FBF2E2]
        text-[#F2A900]
      "
          >
            <CarFront className="h-[22px] w-[22px]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Right Icon */}
        <div className="absolute right-5 top-5">
          <div
            className="
        flex
        h-12
        min-w-12
        items-center
        justify-center
        rounded-xl
        bg-[#FBF2E2]
        px-2
        text-[10px]
        font-bold
        tracking-[0.04em]
        text-[#F2A900]
      "
          >
            CARS / HR
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-[76px]">
          <h2
            className="
        text-[36px]
        font-bold
        leading-[1]
        tracking-[-0.02em]
        text-[#0B1B30]
        dark:text-white
      "
          >
            143
          </h2>

          <p
            className="
        mt-3
        text-[12px]
        font-semibold
        leading-[1.4]
        tracking-[0.08em]
        text-[#7C93B4]
      "
          >
            PEAK TRAFFIC LOAD
          </p>
        </div>
      </div>

      {/* ================= CARD 3 ================= */}
      <div
        className="
    relative
    min-h-[190px]
    overflow-hidden
    rounded-[20px]
    bg-white
    p-6
    shadow-sm
    dark:bg-slate-900
  "
      >
        {/* Left Icon */}
        <div className="absolute left-5 top-5">
          <div
            className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-[#E4F7F5]
        text-[#18A999]
      "
          >
            <ShieldCheck className="h-[22px] w-[22px]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Right Badge */}
        <div className="absolute right-5 top-5">
          <div
            className="
        flex
        h-12
        min-w-[48px]
        items-center
        justify-center
        rounded-xl
        bg-[#E4F7F5]
        px-2
        text-center
        text-[9px]
        font-bold
        leading-[1.2]
        tracking-[0.03em]
        text-[#18A999]
      "
          >
            OPTIMAL
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-[76px]">
          <h2
            className="
        text-[36px]
        font-bold
        leading-[1]
        tracking-[-0.02em]
        text-[#0B1B30]
        dark:text-white
      "
          >
            99.4%
          </h2>

          <p
            className="
        mt-3
        text-[12px]
        font-semibold
        leading-[1.4]
        tracking-[0.07em]
        text-[#7C93B4]
        dark:text-slate-400
      "
          >
            AI RECOGNITION ACCURACY
          </p>
        </div>
      </div>
    </div>
  );
}
