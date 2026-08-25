"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Camera,
  ShieldCheck,
  ArrowUpRight,
  Radio,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

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

export default function DashboardHome() {
  const [entrances, setEntrances] = useState(1284);
  const [peakHourTraffic, setPeakHourTraffic] = useState(142);

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
    <div className="relative w-full min-h-screen text-foreground p-6 md:p-10 overflow-hidden ">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <DashboardStatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-white/[0.03] p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">
                  Traffic Distribution Velocity
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Analysis of patterns between general vehicle entries and
                  residents.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Cars
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />{" "}
                  Residents
                </div>
              </div>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyTrafficData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                    stroke="#ffffff/5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
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

          <div className="rounded-2xl border border-border bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Camera className="text-brand h-7 w-7" />
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[9px] text-brand font-bold tracking-widest uppercase">
                  HEURISTIC FEED
                </span>
              </div>
              <h3 className="text-lg font-bold">Live AI Gateway Stream</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                Our vision node processes license plates and human verification
                layers in less than <b>180ms</b>. Everything is archived
                securely inside the system.
              </p>
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-brand-strong hover:bg-brand text-foreground font-bold py-3.5 text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-600/10">
              Launch Live Vision View <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-white/[0.01] px-6 py-4 text-xs text-muted-foreground">
          <p>
            © 2026 SmartGate Systems Platform • Enterprise Grade Infrastructure
            Security
          </p>
          <div className="flex items-center gap-2 text-sky-400/80">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>All nodes reporting nominal operation states</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
