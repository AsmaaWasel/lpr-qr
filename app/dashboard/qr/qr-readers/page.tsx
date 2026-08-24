"use client";

import {
  PillTabs,
  StatRow,
  SectionCard,
  LPR_TABS,
  QR_TABS,
} from "@/shared/ui/voom";

import ReaderCRUD from "@/components/readers/ReaderCRUD";

export default function ReadersPage() {
  return (
    <div className="space-y-4">
      {/* =========================
          LPR TABS
      ========================= */}

      <PillTabs tabs={QR_TABS} activeValue="/dashboard/qr/qr-readers" />

      {/* =========================
          STATS
      ========================= */}

      <StatRow
        items={[
          {
            label: "TOTAL DEVICES",
            value: 0,
          },
          {
            label: "TOTAL CAMERAS",
            value: 0,
          },
          {
            label: "TOTAL QR READERS",
            value: 0,
          },
          {
            label: "OFFLINE",
            value: 0,
          },
        ]}
      />

      {/* =========================
          CAMERAS CRUD
      ========================= */}

      <SectionCard>
        <ReaderCRUD />
      </SectionCard>
    </div>
  );
}
