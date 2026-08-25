// app/dashboard/visitor-logs/page.tsx

"use client";

import { useState } from "react";

import { PillTabs, REPORT_TABS } from "@/shared/ui/voom";

import QRVisitorFilters, {
  QRVisitorFilterData,
} from "@/components/reports.tsx/QRVisitorFilters";

import QRVisitorLogsTable from "@/components/reports.tsx/QRVisitorLogsTable";

export default function VisitorLogsPage() {
  const [filters, setFilters] = useState<QRVisitorFilterData>({
    qrCodeId: "",
    residentName: "",
    fromDate: "",
    toDate: "",
  });

  const handleApply = (newFilters: QRVisitorFilterData) => {
    setFilters(newFilters);

    console.log("Applied QR visitor filters:", newFilters);
  };

  const handleExport = (currentFilters: QRVisitorFilterData) => {
    console.log("Export QR visitor logs:", currentFilters);
  };

  return (
    <div className="space-y-6 p-6">
      {/* REPORT TABS */}
      <PillTabs tabs={REPORT_TABS} activeValue="/dashboard/reports/qr" />

      {/* FILTERS */}
      <QRVisitorFilters onApply={handleApply} onExport={handleExport} />

      {/* TABLE */}
      <QRVisitorLogsTable />
    </div>
  );
}
