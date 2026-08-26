"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import GateEntriesTable from "@/components/reports/GateEntriesLPRTable";

export default function DashboardHome() {
  const [entrances, setEntrances] = useState(1284);
  const [peakHourTraffic, setPeakHourTraffic] = useState(142);
  const router = useRouter();

  const hourlyTrafficData = [
    { time: "06:00 AM", Cars: 45, Residents: 30 },
    { time: "08:00 AM", Cars: 180, Residents: 140 },
    { time: "10:00 AM", Cars: 95, Residents: 70 },
    { time: "12:00 PM", Cars: 120, Residents: 85 },
    { time: "02:00 PM", Cars: 210, Residents: 165 },
    { time: "04:00 PM", Cars: 150, Residents: 110 },
    { time: "06:00 PM", Cars: 85, Residents: 60 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setEntrances((prev) => prev + Math.floor(Math.random() * 2));

      if (Math.random() > 0.7) {
        setPeakHourTraffic((prev) => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-transparent text-foreground px-4 py-6 md:px-6 md:py-8 overflow-hidden">
      <div className="relative z-10 w-full space-y-8">
        {/* Stats */}
        <DashboardStatsCards />

        {/* Main Grid */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Traffic Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-[700] text-[20px]">
                  Traffic Distribution Velocity
                </h3>

                <p className="text-[16px] font-[500] text-[#7C93B4] mt-0.5">
                  Analysis of patterns between general vehicle entries and
                  residents.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[16px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  Cars
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Residents
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyTrafficData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />

                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="colorResidents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />

                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0b1329",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="Cars"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCars)"
                  />

                  <Area
                    type="monotone"
                    dataKey="Residents"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResidents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Vision Card */}
          <div
            className="flex flex-col justify-between rounded-2xl border border-border p-6"
            style={{
              background: "linear-gradient(165deg, #16324F, #0B1B30)",
            }}
          >
            <div>
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <Camera className="h-7 w-7 text-brand" />

                <span className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[14px] font-bold tracking-widest text-brand uppercase">
                  HEURISTIC FEED
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[20px] font-[700] text-white">
                Live AI Gateway Stream
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Our vision node processes license plates and human verification
                layers in less than <b>180ms</b>. Everything is archived
                securely inside the system.
              </p>

              {/* Live Camera Preview */}
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                {/* Camera Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Red Live Indicator */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>

                    <span className="text-[11px] font-bold tracking-wider text-white">
                      CAM-01 · LIVE
                    </span>
                  </div>

                  <span className="text-[9px] tracking-widest text-slate-400 uppercase">
                    AI VISION
                  </span>
                </div>

                {/* Camera View */}
                <div className="relative flex h-[120px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
                  {/* Scan Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[length:100%_4px] opacity-10" />

                  {/* Detection Box */}
                  <div className="relative rounded-md border border-cyan-400/60 px-6 py-3">
                    <div className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-cyan-400" />

                    <div className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-cyan-400" />

                    <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-400" />

                    <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-400" />

                    <span className="text-[15px] font-bold tracking-[0.25em] text-white">
                      ا ب خ 12398
                    </span>
                  </div>

                  {/* Scanning Line */}
                  <div className="absolute top-1/2 right-0 left-0 h-px bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>

                {/* Camera Status */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[9px] text-slate-400">
                    LICENSE PLATE DETECTED
                  </span>

                  <span className="text-[9px] font-bold text-emerald-400">
                    180ms
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <Link
              href="/dashboard/live-vision"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-strong py-3.5 text-xs font-bold tracking-wider text-foreground uppercase shadow-lg shadow-sky-600/10 transition-all hover:bg-brand"
            >
              Launch Live Vision View
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          {/* =========================
      LIVE ACCESS FEED HEADER
  ========================= */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <h2 className="text-[20px] font-[700] text-foreground">
                Live access feed
              </h2>

              {/* Live Indicator */}
              <span
                className="
          h-3
          w-3
          rounded-full
          bg-red-500
          shadow-[0_0_10px_rgba(239,68,68,0.8)]
          animate-pulse
        "
              />
            </div>

            {/* Right Side */}
            <button
              type="button"
              onClick={() => router.push("/dashboard/reports/lpr")}
              className="
        text-[20px]
        font-[600]
        text-[#29C5E8]
        transition-colors
        hover:text-[#1eb4d5]
        hover:underline
      "
            >
              Open full report
            </button>
          </div>

          {/* =========================
      TABLE
  ========================= */}
          <GateEntriesTable
            data={[]}
            selectedId={null}
            onSelect={(id: number) => {
              // handle select
            }}
            onImageClick={(url: string) => {
              // handle image click
            }}
          />
        </div>
      </div>
    </div>
  );
}
