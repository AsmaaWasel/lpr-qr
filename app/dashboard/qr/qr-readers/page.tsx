"use client";

import { useState } from "react";

import { PillTabs, StatRow, SectionCard, QR_TABS } from "@/shared/ui/voom";

import ReaderCRUD from "@/components/readers/ReaderCRUD";

type ReaderStats = {
  totalDevices: number;
  totalCameras: number;
  totalQrReaders: number;
  offline: number;
};

export default function ReadersPage() {
  const [stats, setStats] = useState<ReaderStats>({
    totalDevices: 0,
    totalCameras: 0,
    totalQrReaders: 0,
    offline: 0,
  });

  return (
    <div className="space-y-4">
      {/* =========================
          QR TABS
      ========================= */}

      <PillTabs tabs={QR_TABS} activeValue="/dashboard/qr/qr-readers" />

      {/* =========================
          STATS
      ========================= */}

      <StatRow
        items={[
          {
            label: "TOTAL DEVICES",
            value: stats.totalDevices,
          },
          {
            label: "TOTAL CAMERAS",
            value: stats.totalCameras,
          },
          {
            label: "TOTAL QR READERS",
            value: stats.totalQrReaders,
          },
          {
            label: "OFFLINE",
            value: stats.offline,
          },
        ]}
      />

      {/* =========================
          READERS CRUD
      ========================= */}

      <SectionCard>
        <ReaderCRUD onStatsChange={setStats} />
      </SectionCard>
    </div>
  );
}
