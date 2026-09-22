"use client";

import { useEffect, useState } from "react";

import { Camera, Circle, Maximize2, ShieldCheck } from "lucide-react";

type CameraData = {
  id: string;
  name: string;
  plate: string;
  location: string;
  status: "LIVE" | "OFFLINE";
};

const cameras: CameraData[] = [
  {
    id: "CAM-01",
    name: "Main Entrance",
    plate: "ا ب خ 12398",
    location: "North Gate",
    status: "LIVE",
  },
  {
    id: "CAM-02",
    name: "Residents Gate",
    plate: "س م ر 45821",
    location: "East Gate",
    status: "LIVE",
  },
  {
    id: "CAM-03",
    name: "Visitor Gate",
    plate: "د ع ن 76124",
    location: "West Gate",
    status: "LIVE",
  },
  {
    id: "CAM-04",
    name: "Parking Entrance",
    plate: "ر ب ك 98321",
    location: "Parking Area",
    status: "LIVE",
  },
  {
    id: "CAM-05",
    name: "Service Gate",
    plate: "م س ح 51236",
    location: "South Gate",
    status: "LIVE",
  },
  {
    id: "CAM-06",
    name: "Back Entrance",
    plate: "ع ك ل 34567",
    location: "Back Gate",
    status: "LIVE",
  },
];

function CameraCard({ camera }: { camera: CameraData }) {
  const [scanPosition, setScanPosition] = useState(45);
  const [latency, setLatency] = useState(180);

  const isLive = camera.status === "LIVE";

  useEffect(() => {
    if (!isLive) return;

    const scanInterval = setInterval(() => {
      setScanPosition((prev) => {
        if (prev >= 88) return 12;
        return prev + 4;
      });
    }, 150);

    const latencyInterval = setInterval(() => {
      setLatency(165 + Math.floor(Math.random() * 30));
    }, 2000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(latencyInterval);
    };
  }, [isLive]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] shadow-xl">
      {/* Camera Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0b192b] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10">
            <Camera className="h-4 w-4 text-sky-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}

              <span className="text-xs font-bold tracking-wide text-white">
                {camera.id}
              </span>

              <span
                className={
                  isLive
                    ? "text-[9px] font-bold text-red-400"
                    : "text-[9px] font-bold text-slate-500"
                }
              >
                · {camera.status}
              </span>
            </div>

            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">
              {camera.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#0d1b2d] via-[#07111f] to-[#020812]">
        {isLive ? (
          <>
            {/* Fake Camera Environment */}
            <div className="absolute inset-0">
              <div className="absolute left-[8%] top-[15%] h-[55%] w-[25%] rounded-lg border border-white/5 bg-white/[0.02]" />

              <div className="absolute right-[10%] top-[20%] h-[45%] w-[30%] rounded-lg border border-white/5 bg-white/[0.02]" />

              <div className="absolute bottom-[12%] left-[15%] right-[15%] h-px bg-white/10" />

              <div className="absolute bottom-[20%] left-[20%] right-[20%] h-px bg-white/5" />
            </div>

            {/* Scan Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[length:100%_4px] opacity-10" />

            {/* Camera Corners */}
            <div className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-cyan-400/70" />

            <div className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-cyan-400/70" />

            <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-cyan-400/70" />

            <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-cyan-400/70" />

            {/* Detection Box */}
            <div
              className="absolute left-1/2 transition-all duration-150"
              style={{
                top: `${scanPosition}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative rounded-md border border-cyan-400 px-5 py-2 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <div className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-cyan-300" />

                <div className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-cyan-300" />

                <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-300" />

                <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-300" />

                <p className="whitespace-nowrap text-center text-xs font-bold tracking-[0.2em] text-white">
                  {camera.plate}
                </p>
              </div>
            </div>

            {/* Scanner */}
            <div
              className="absolute left-0 right-0 h-px bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)] transition-all duration-150"
              style={{
                top: `${scanPosition}%`,
              }}
            />

            {/* Location */}
            <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/50 px-2 py-1 backdrop-blur-md">
              <span className="text-[8px] font-medium uppercase tracking-widest text-slate-400">
                {camera.location}
              </span>
            </div>

            {/* Live */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md border border-red-500/20 bg-black/50 px-2 py-1 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500" />

                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>

              <span className="text-[8px] font-bold uppercase tracking-widest text-white">
                LIVE
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="h-8 w-8 text-slate-700" />

            <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Camera Offline
            </span>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="grid grid-cols-3 border-t border-white/10">
        <div className="border-r border-white/10 px-3 py-2.5">
          <p className="text-[8px] uppercase tracking-widest text-slate-500">
            Plate
          </p>

          <p className="mt-1 truncate text-[10px] font-bold text-white">
            {camera.plate}
          </p>
        </div>

        <div className="border-r border-white/10 px-3 py-2.5">
          <p className="text-[8px] uppercase tracking-widest text-slate-500">
            Latency
          </p>

          <p className="mt-1 text-[10px] font-bold text-emerald-400">
            {isLive ? `${latency}ms` : "--"}
          </p>
        </div>

        <div className="px-3 py-2.5">
          <p className="text-[8px] uppercase tracking-widest text-slate-500">
            Status
          </p>

          <div className="mt-1 flex items-center gap-1">
            <ShieldCheck
              className={`h-3 w-3 ${
                isLive ? "text-emerald-400" : "text-slate-600"
              }`}
            />

            <span
              className={`text-[10px] font-bold ${
                isLive ? "text-emerald-400" : "text-slate-600"
              }`}
            >
              {isLive ? "Verified" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveCameraStream() {
  const onlineCameras = cameras.filter(
    (camera) => camera.status === "LIVE",
  ).length;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-transparent text-foreground">
      <div className="w-full space-y-6 px-4 py-6 md:px-6 md:py-8">
        {/* Stream Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Camera Streams
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Real-time monitoring across all gateway cameras
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-3 py-2">
            <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />

            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              {onlineCameras} Cameras Online
            </span>
          </div>
        </div>

        {/* Cameras Grid */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cameras.map((camera) => (
            <CameraCard key={camera.id} camera={camera} />
          ))}
        </div>
      </div>
    </div>
  );
}
