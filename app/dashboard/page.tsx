"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Camera, ArrowUpRight } from "lucide-react";

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
import { GateEntry, getGateEntries } from "@/services/gateEntry";

export default function DashboardHome() {
  const [gateEntries, setGateEntries] = useState<GateEntry[]>([]);
  const [hourlyTrafficData, setHourlyTrafficData] = useState<
    {
      time: string;
      Cars: number;
      Residents: number;
    }[]
  >([]);

  const [entrances, setEntrances] = useState(0);
  const [peakHourTraffic, setPeakHourTraffic] = useState(0);

  // =====================================================
  // FETCH GATE ENTRIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchGateEntries = async () => {
      try {
        const data = await getGateEntries();

        if (mounted) {
          setGateEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch gate entries:", error);
      }
    };

    fetchGateEntries();

    // Refresh every 30 seconds
    const interval = setInterval(fetchGateEntries, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // CALCULATE DASHBOARD TRAFFIC
  // =====================================================

  useEffect(() => {
    if (!gateEntries.length) {
      setHourlyTrafficData([]);
      setEntrances(0);
      setPeakHourTraffic(0);
      return;
    }

    const now = new Date();

    // Start of today
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    // End of today
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // =====================================================
    // ONLY TODAY'S ENTRY LOGS
    // =====================================================

    const todayEntries = gateEntries.filter((entry) => {
      if (entry.entry_type !== "ENTRY") {
        return false;
      }

      const createdAt = new Date(entry.created_at);

      return createdAt >= startOfToday && createdAt <= endOfToday;
    });

    // =====================================================
    // TOTAL ENTRANCES
    // =====================================================

    setEntrances(todayEntries.length);

    // =====================================================
    // INITIALIZE HOURLY DATA
    // =====================================================

    const hourlyMap: Record<
      number,
      {
        Cars: number;
        Residents: number;
      }
    > = {};

    for (let hour = 0; hour < 24; hour++) {
      hourlyMap[hour] = {
        Cars: 0,
        Residents: 0,
      };
    }

    // =====================================================
    // DISTRIBUTE LOGS BY HOUR
    // =====================================================

    todayEntries.forEach((entry) => {
      const createdAt = new Date(entry.created_at);

      const hour = createdAt.getHours();

      // NORMAL = Resident
      if (entry.entry_by === "NORMAL") {
        hourlyMap[hour].Residents += 1;
      }

      // QR = Other vehicles
      if (entry.entry_by === "QR") {
        hourlyMap[hour].Cars += 1;
      }
    });

    // =====================================================
    // CREATE CHART DATA
    // =====================================================

    const chartData = Object.entries(hourlyMap)
      .map(([hour, values]) => {
        const hourNumber = Number(hour);

        const formattedHour = `${hourNumber.toString().padStart(2, "0")}:00`;

        return {
          time: formattedHour,
          Cars: values.Cars,
          Residents: values.Residents,
          total: values.Cars + values.Residents,
        };
      })
      .filter((item) => item.total > 0);

    setHourlyTrafficData(
      chartData.map(({ time, Cars, Residents }) => ({
        time,
        Cars,
        Residents,
      })),
    );

    // =====================================================
    // CALCULATE PEAK HOUR
    // =====================================================

    if (chartData.length > 0) {
      const peak = chartData.reduce((max, current) => {
        return current.Cars + current.Residents > max.Cars + max.Residents
          ? current
          : max;
      });

      setPeakHourTraffic(peak.Cars + peak.Residents);
    } else {
      setPeakHourTraffic(0);
    }
  }, [gateEntries]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent px-4 py-6 text-foreground md:px-6 md:py-8">
      <div className="relative z-10 w-full space-y-8">
        {/* =====================================================
            STATS
        ===================================================== */}

        <DashboardStatsCards />

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =====================================================
              TRAFFIC CHART
          ===================================================== */}

          <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-2">
            {/* Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[20px] font-[700]">
                  Traffic Distribution Velocity
                </h3>

                <p className="mt-0.5 text-[16px] font-[500] text-[#7C93B4]">
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

            {/* =====================================================
                CHART
            ===================================================== */}

            <div className="h-[260px] w-full">
              {hourlyTrafficData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[#7C93B4]">
                  No traffic data available for today
                </div>
              ) : (
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
                    {/* Gradients */}

                    <defs>
                      <linearGradient
                        id="colorCars"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#38bdf8"
                          stopOpacity={0.2}
                        />

                        <stop
                          offset="95%"
                          stopColor="#38bdf8"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="colorResidents"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.2}
                        />

                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid */}

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />

                    {/* X Axis */}

                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />

                    {/* Y Axis */}

                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    {/* Tooltip */}

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1329",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    {/* Cars */}

                    <Area
                      type="monotone"
                      dataKey="Cars"
                      name="Cars"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCars)"
                    />

                    {/* Residents */}

                    <Area
                      type="monotone"
                      dataKey="Residents"
                      name="Residents"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorResidents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* =====================================================
              AI VISION CARD
          ===================================================== */}

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

                <span className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[14px] font-bold uppercase tracking-widest text-brand">
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

              {/* =====================================================
                  LIVE CAMERA PREVIEW
              ===================================================== */}

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

                  <span className="text-[9px] uppercase tracking-widest text-slate-400">
                    AI VISION
                  </span>
                </div>

                {/* Camera View */}

                <div className="relative flex h-[120px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
                  {/* Scan Lines */}

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[length:100%_4px] opacity-10" />

                  {/* Detection Box */}

                  <div className="relative rounded-md border border-cyan-400/60 px-6 py-3">
                    <div className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-cyan-400" />

                    <div className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-cyan-400" />

                    <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-400" />

                    <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-400" />

                    <span className="text-[15px] font-bold tracking-[0.25em] text-white">
                      ا ب خ 12398
                    </span>
                  </div>

                  {/* Scanning Line */}

                  <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
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
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-strong py-3.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-lg shadow-sky-600/10 transition-all hover:bg-brand"
            >
              Launch Live Vision View
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
