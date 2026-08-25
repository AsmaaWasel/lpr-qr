"use client";

import { PillTabs, REPORT_TABS } from "@/shared/ui/voom";

import { useForm } from "react-hook-form";
import QRVisitorLogsTable from "@/components/reports/QRVisitorLogsTable";
import QRReportFilters, {
  QRReportFilterData,
} from "@/components/reports/QRVisitorFilters";

export default function QRReportsPage() {
  const { handleSubmit } = useForm<QRReportFilterData>();

  const onSubmit = (data: QRReportFilterData) => {
    console.log("QR Report filters:", data);
  };

  return (
    <div className="space-y-6">
      {/* =========================
                  QR TABS
          ========================= */}
      <PillTabs tabs={REPORT_TABS} activeValue="/dashboard/reports/qr" />

      {/* =========================
                  FILTERS
          ========================= */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <QRReportFilters onApply={onSubmit} onExport={onSubmit} />
      </form>

      {/* =========================
                   TABLE
          ========================= */}
      <div className="mt-6">
        <QRVisitorLogsTable
          data={[]}
          selectedId={null}
          onSelect={(id: number) => {
            console.log("Selected QR:", id);
          }}
          onImageClick={function (url: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
