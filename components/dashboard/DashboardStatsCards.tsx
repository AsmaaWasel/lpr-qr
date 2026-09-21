"use client";

import { useEffect, useState } from "react";
import { Users, CarFront, TrendingDown, ChevronDown } from "lucide-react";

import { getGateEntries } from "@/services/gateEntry";

type Period = "day" | "month" | "year";

export default function DashboardStatsCards() {
  const [period, setPeriod] = useState<Period>("day");

  const [totalAccesses, setTotalAccesses] = useState(0);
  const [peakTrafficLoad, setPeakTrafficLoad] = useState(0);
  const [lowTrafficLoad, setLowTrafficLoad] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const entries = await getGateEntries();

        const now = new Date();

        let startDate: Date;
        let endDate: Date;

        // =====================================================
        // SELECT DATE RANGE
        // =====================================================

        if (period === "day") {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0,
          );

          endDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999,
          );
        } else if (period === "month") {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
            0,
          );

          endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
        } else {
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        }

        // =====================================================
        // FILTER ENTRIES
        // =====================================================

        const filteredEntries = entries.filter((entry) => {
          const createdAt = new Date(entry.created_at);

          return createdAt >= startDate && createdAt <= endDate;
        });

        // =====================================================
        // TOTAL ACCESSES
        // =====================================================

        setTotalAccesses(filteredEntries.length);

        // =====================================================
        // TRAFFIC LOAD
        //
        // DAY   -> traffic grouped by hour
        // MONTH -> traffic grouped by day
        // YEAR  -> traffic grouped by month
        // =====================================================

        const trafficMap: Record<string, number> = {};

        filteredEntries.forEach((entry) => {
          const createdAt = new Date(entry.created_at);

          let key: string;

          if (period === "day") {
            // 00:00, 01:00, 02:00...
            key = String(createdAt.getHours());
          } else if (period === "month") {
            // 1, 2, 3... days of the month
            key = String(createdAt.getDate());
          } else {
            // 0 = January, 1 = February...
            key = String(createdAt.getMonth());
          }

          trafficMap[key] = (trafficMap[key] || 0) + 1;
        });

        const trafficValues = Object.values(trafficMap);

        // =====================================================
        // PEAK TRAFFIC
        // =====================================================

        const peakTraffic =
          trafficValues.length > 0 ? Math.max(...trafficValues) : 0;

        setPeakTrafficLoad(peakTraffic);

        // =====================================================
        // LOW TRAFFIC
        //
        // Ignore periods with zero traffic.
        // =====================================================

        const lowTraffic =
          trafficValues.length > 0 ? Math.min(...trafficValues) : 0;

        setLowTrafficLoad(lowTraffic);
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);

        setTotalAccesses(0);
        setPeakTrafficLoad(0);
        setLowTrafficLoad(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  // =====================================================
  // PERIOD LABEL
  // =====================================================

  const periodLabel = {
    day: "TODAY",
    month: "THIS MONTH",
    year: "THIS YEAR",
  }[period];

  return (
    <div className="space-y-5">
      {/* =====================================================
PERIOD SELECTOR
===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0B1B30] dark:text-white">
            Traffic Statistics
          </h2>

          <p className="mt-1 text-[13px] font-medium text-[#7C93B4]">
            View access statistics by selected period
          </p>
        </div>

        {/* Period Dropdown */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="h-11 min-w-[150px] appearance-none rounded-xl border border-border bg-white px-4 pr-10 text-sm font-semibold text-[#0B1B30] outline-none transition focus:border-[#29C5E8] dark:bg-slate-900 dark:text-white"
          >
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C93B4]" />
        </div>
      </div>
      {/* =====================================================
      STAT CARDS
  ===================================================== */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* =====================================================
        CARD 1 - TOTAL ACCESSES
    ===================================================== */}

        <div className="relative min-h-[190px] overflow-hidden rounded-[20px] bg-[#0B1B30] p-6 shadow-sm">
          {/* Icon */}
          <div className="absolute left-5 top-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16324F] text-[#29C5E8]">
              <Users className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
          </div>

          {/* Period Badge */}
          <div className="absolute right-5 top-5">
            <div className="flex h-12 min-w-[48px] items-center justify-center rounded-xl bg-[#16324F] px-2 text-center text-[9px] font-bold leading-[1.2] tracking-[0.03em] text-[#29C5E8]">
              {periodLabel}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-[76px]">
            <h2 className="text-[36px] font-bold leading-[1] tracking-[-0.02em] text-white">
              {loading ? "..." : totalAccesses.toLocaleString()}
            </h2>

            <p className="mt-3 text-[12px] font-semibold leading-[1.4] tracking-[0.07em] text-[#7C93B4]">
              TOTAL ACCESSES
            </p>
          </div>
        </div>

        {/* =====================================================
        CARD 2 - PEAK TRAFFIC
    ===================================================== */}

        <div className="relative min-h-[190px] overflow-hidden rounded-[20px] bg-white p-6 shadow-sm dark:bg-slate-900">
          {/* Icon */}
          <div className="absolute left-5 top-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBF2E2] text-[#F2A900]">
              <CarFront className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
          </div>

          {/* Period Badge */}
          <div className="absolute right-5 top-5">
            <div className="flex h-12 min-w-[48px] items-center justify-center rounded-xl bg-[#FBF2E2] px-2 text-center text-[9px] font-bold leading-[1.2] text-[#F2A900]">
              {period === "day"
                ? "PER HOUR"
                : period === "month"
                  ? "PER DAY"
                  : "PER MONTH"}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-[76px]">
            <h2 className="text-[36px] font-bold leading-[1] tracking-[-0.02em] text-[#0B1B30] dark:text-white">
              {loading ? "..." : peakTrafficLoad.toLocaleString()}
            </h2>

            <p className="mt-3 text-[12px] font-semibold leading-[1.4] tracking-[0.08em] text-[#7C93B4] dark:text-slate-400">
              PEAK TRAFFIC LOAD
            </p>
          </div>
        </div>

        {/* =====================================================
        CARD 3 - LOW TRAFFIC
    ===================================================== */}

        <div className="relative min-h-[190px] overflow-hidden rounded-[20px] bg-white p-6 shadow-sm dark:bg-slate-900">
          {/* Icon */}
          <div className="absolute left-5 top-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F4EE] text-[#18A999]">
              <TrendingDown className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
          </div>

          {/* Period Badge */}
          <div className="absolute right-5 top-5">
            <div className="flex h-12 min-w-[48px] items-center justify-center rounded-xl bg-[#E8F4EE] px-2 text-center text-[9px] font-bold leading-[1.2] text-[#18A999]">
              {period === "day"
                ? "PER HOUR"
                : period === "month"
                  ? "PER DAY"
                  : "PER MONTH"}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-[76px]">
            <h2 className="text-[36px] font-bold leading-[1] tracking-[-0.02em] text-[#0B1B30] dark:text-white">
              {loading ? "..." : lowTrafficLoad.toLocaleString()}
            </h2>

            <p className="mt-3 text-[12px] font-semibold leading-[1.4] tracking-[0.08em] text-[#7C93B4] dark:text-slate-400">
              LOW TRAFFIC LOAD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
