"use client";

import { useEffect, useState } from "react";

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

    // =====================================================
    // START OF TODAY
    // =====================================================

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    // =====================================================
    // END OF TODAY
    // =====================================================

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

    // Always create all 24 hours
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

    // Keep all 24 hours so the chart is distributed
    // across the full horizontal axis.
    const chartData = Object.entries(hourlyMap).map(([hour, values]) => {
      const hourNumber = Number(hour);

      const formattedHour = `${hourNumber.toString().padStart(2, "0")}:00`;

      return {
        time: formattedHour,
        Cars: values.Cars,
        Residents: values.Residents,
        total: values.Cars + values.Residents,
      };
    });

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

    const peak = chartData.reduce((max, current) => {
      return current.Cars + current.Residents > max.Cars + max.Residents
        ? current
        : max;
    }, chartData[0]);

    setPeakHourTraffic(peak ? peak.Cars + peak.Residents : 0);
  }, [gateEntries]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent px-4 py-6 text-foreground md:px-6 md:py-8">
      {" "}
      <div className="relative z-10 w-full space-y-8">
        {/* =====================================================
        STATS
    ===================================================== */}

        <DashboardStatsCards />

        {/* =====================================================
        MAIN GRID
    ===================================================== */}

        <div className="grid w-full grid-cols-1 gap-6">
          {/* =====================================================
          TRAFFIC DISTRIBUTION
      ===================================================== */}

          <div className="w-full rounded-2xl border border-border bg-white p-6 dark:bg-slate-900">
            {/* Header */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-[20px] font-[700] text-[#0B1B30] dark:text-white">
                  Traffic Distribution Velocity
                </h3>

                <p className="mt-0.5 text-[16px] font-[500] text-[#7C93B4]">
                  Analysis of patterns between general vehicle entries and
                  residents.
                </p>
              </div>

              {/* Legend */}

              <div className="flex items-center gap-5 text-[15px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                  <span className="text-[#0B1B30] dark:text-white">Cars</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span className="text-[#0B1B30] dark:text-white">
                    Residents
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================================
            CHART
        ===================================================== */}

            <div className="h-[320px] w-full">
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
                      right: 20,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    {/* =================================================
                    GRADIENTS
                ================================================= */}

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

                    {/* =================================================
                    GRID
                ================================================= */}

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />

                    {/* =================================================
                    X AXIS
                ================================================= */}

                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval={1}
                    />

                    {/* =================================================
                    Y AXIS
                ================================================= */}

                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    {/* =================================================
                    TOOLTIP
                ================================================= */}

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1329",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    {/* =================================================
                    CARS
                ================================================= */}

                    <Area
                      type="monotone"
                      dataKey="Cars"
                      name="Cars"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCars)"
                    />

                    {/* =================================================
                    RESIDENTS
                ================================================= */}

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
        </div>
      </div>
    </div>
  );
}
