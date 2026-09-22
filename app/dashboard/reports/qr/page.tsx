"use client";

import { useEffect, useMemo, useState } from "react";

import { PillTabs, REPORT_TABS } from "@/shared/ui/voom";

import QRVisitorLogsTable from "@/components/reports/QRVisitorLogsTable";

import QRReportFilters, {
  QRReportFilterData,
} from "@/components/reports/QRVisitorFilters";

import { getVisitorLogs, VisitorLog } from "@/services/visitorLogs";

export default function QRReportsPage() {
  // =========================
  // DATA
  // =========================

  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // APPLIED FILTERS
  // =========================

  const [appliedFilters, setAppliedFilters] =
    useState<QRReportFilterData | null>(null);

  // =========================
  // GET DATA
  // =========================

  useEffect(() => {
    let cancelled = false;

    const loadVisitorLogs = async () => {
      try {
        console.log("Fetching visitor logs...");

        const response = await getVisitorLogs(0, 50);

        console.log("Visitor logs response:", response);

        if (!cancelled) {
          setLogs(response);
        }
      } catch (error) {
        console.error("Failed to fetch visitor logs:", error);

        if (!cancelled) {
          setLogs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVisitorLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // FILTER FUNCTION
  // =========================

  const filterLogs = (data: VisitorLog[], filters: QRReportFilterData) => {
    return data.filter((log) => {
      // =========================
      // QR CODE ID
      // =========================

      if (filters.qrCodeId?.trim()) {
        if (String(log.qr_code_id) !== filters.qrCodeId.trim()) {
          return false;
        }
      }

      // =========================
      // VISITOR NAME
      // =========================

      if (filters.visitorName?.trim()) {
        const search = filters.visitorName.trim().toLowerCase();

        const visitorName = log.visitor_full_name?.toLowerCase() || "";

        if (!visitorName.includes(search)) {
          return false;
        }
      }

      // =========================
      // VISITOR NATIONAL ID
      // =========================

      if (filters.visitorNationalId?.trim()) {
        const search = filters.visitorNationalId.trim().toLowerCase();

        const visitorNationalId = log.visitor_national_id?.toLowerCase() || "";

        if (!visitorNationalId.includes(search)) {
          return false;
        }
      }

      // =========================
      // VISITOR PHONE
      // =========================

      if (filters.visitorPhone?.trim()) {
        const search = filters.visitorPhone.trim().toLowerCase();

        const visitorPhone = log.visitor_phone_number?.toLowerCase() || "";

        if (!visitorPhone.includes(search)) {
          return false;
        }
      }

      // =========================
      // RESIDENT NAME
      // =========================

      if (filters.residentName?.trim()) {
        const search = filters.residentName.trim().toLowerCase();

        const residentName = log.resident?.full_name?.toLowerCase() || "";

        const residentNameAr = log.resident?.full_name_ar?.toLowerCase() || "";

        if (
          !residentName.includes(search) &&
          !residentNameAr.includes(search)
        ) {
          return false;
        }
      }

      // =========================
      // RESIDENT NATIONAL ID
      // =========================

      if (filters.residentNationalId?.trim()) {
        const search = filters.residentNationalId.trim().toLowerCase();

        const residentNationalId =
          log.resident?.national_id?.toLowerCase() || "";

        if (!residentNationalId.includes(search)) {
          return false;
        }
      }

      // =========================
      // RESIDENT PHONE
      // =========================

      if (filters.residentPhone?.trim()) {
        const search = filters.residentPhone.trim().toLowerCase();

        const residentPhone =
          log.resident?.phone_numbers?.[0]?.phone_number?.toLowerCase() || "";

        if (!residentPhone.includes(search)) {
          return false;
        }
      }

      // =========================
      // PLATE NUMBER
      // =========================

      if (filters.plateNumber?.trim()) {
        const search = filters.plateNumber.trim().toLowerCase();

        const plate = log.plate_number?.toLowerCase() || "";

        if (!plate.includes(search)) {
          return false;
        }
      }

      // =========================
      // STATUS
      // =========================

      if (filters.status && filters.status !== "all") {
        if (log.status?.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // =========================
      // LOG DATE
      // =========================

      const logDate = new Date(log.entry_time || log.created_at);

      // =========================
      // FROM DATE
      // =========================

      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);

        fromDate.setHours(0, 0, 0, 0);

        if (logDate < fromDate) {
          return false;
        }
      }

      // =========================
      // TO DATE
      // =========================

      if (filters.toDate) {
        const toDate = new Date(filters.toDate);

        toDate.setHours(23, 59, 59, 999);

        if (logDate > toDate) {
          return false;
        }
      }

      return true;
    });
  };

  // =========================
  // APPLY FILTERS
  // =========================

  const handleApplyFilters = (filters: QRReportFilterData) => {
    console.log("Applied QR filters:", filters);

    setAppliedFilters(filters);
    setSelectedId(null);
  };

  // =========================
  // FILTERED DATA
  // =========================

  const filteredLogs = useMemo(() => {
    if (!appliedFilters) {
      return logs;
    }

    return filterLogs(logs, appliedFilters);
  }, [logs, appliedFilters]);

  // =========================
  // EXPORT
  // =========================

  const handleExport = (filters: QRReportFilterData) => {
    console.log("Export QR filters:", filters);

    const dataToExport = filterLogs(logs, filters);

    console.log("Data to export:", dataToExport);

    // Add PDF export here later
  };

  // =========================
  // IMAGE
  // =========================

  const handleImageClick = (url: string) => {
    window.open(url, "_blank");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-6">
      {/* =========================
          TABS
      ========================= */}

      <PillTabs tabs={REPORT_TABS} activeValue="/dashboard/reports/qr" />

      {/* =========================
          FILTERS
      ========================= */}

      <QRReportFilters onApply={handleApplyFilters} onExport={handleExport} />

      {/* =========================
          RESULT COUNT
      ========================= */}

      {!loading && (
        <div className="px-1 text-sm font-semibold text-[#7C93B4]">
          Showing {filteredLogs.length} of {logs.length} visitor logs
        </div>
      )}

      {/* =========================
          TABLE
      ========================= */}

      <div className="mt-6">
        {loading ? (
          <div
            className="
              rounded-[24px]
              bg-card
              px-6
              py-12
              text-center
              text-lg
              text-muted-foreground
              shadow-sm
            "
          >
            Loading visitor logs...
          </div>
        ) : (
          <QRVisitorLogsTable
            data={filteredLogs}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onImageClick={handleImageClick}
          />
        )}
      </div>
    </div>
  );
}
