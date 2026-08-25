"use client";

import Link from "next/link";
import { ArrowLeft, Camera, ShieldCheck, Activity, Radio } from "lucide-react";

import LiveCameraStream from "@/components/LiveCameraStream";

export default function LiveVisionPage() {
  return (
    <div className="min-h-screen w-full bg-transparent text-foreground p-4 md:p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            {/* Breadcrumb */}
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-[#7C93B4] transition hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>

              <span className="text-slate-300">/</span>

              <span className="text-sm font-medium text-foreground">
                Live Vision
              </span>
            </div>

            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
                <Camera className="h-5 w-5 text-brand" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Live Vision Stream</h1>

                <p className="mt-1 text-sm text-[#7C93B4]">
                  Real-time AI camera monitoring and license plate detection.
                </p>
              </div>
            </div>
          </div>

          {/* Live Status */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
              System Live
            </span>
          </div>
        </div>

        {/* Camera Streams */}
        <LiveCameraStream />
      </div>
    </div>
  );
}
