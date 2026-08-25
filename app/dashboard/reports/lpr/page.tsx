"use client";

import GateEntriesTable from "@/components/reports/GateEntriesLPRTable";

import ReportFilters, {
  ReportFilterData,
} from "@/components/reports/ReportLPRFilters";
import { PillTabs, REPORT_TABS } from "@/shared/ui/voom";

import { useForm } from "react-hook-form";

export default function ReportsPage() {
  const { handleSubmit } = useForm<ReportFilterData>();

  const onSubmit = (data: ReportFilterData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="space-y-6">
      {/* =========================
                LPR TABS
            ========================= */}

      <PillTabs tabs={REPORT_TABS} activeValue="/dashboard/reports/lpr" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ReportFilters onApply={onSubmit} onExport={onSubmit} />
      </form>

      <div className="mt-6">
        <GateEntriesTable
          data={[]}
          selectedId={null}
          onSelect={function (id: number): void {
            throw new Error("Function not implemented.");
          }}
          onImageClick={function (url: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
