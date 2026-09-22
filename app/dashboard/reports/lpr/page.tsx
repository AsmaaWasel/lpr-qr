"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";

import GateEntriesTable from "@/components/reports/GateEntriesLPRTable";
import { PillTabs, REPORT_TABS } from "@/shared/ui/voom";
import { getGateEntries, GateEntry } from "@/services/gateEntry";
import LPRReportFilters, {
  LPRReportFilterData,
} from "@/components/reports/ReportLPRFilters";

export default function ReportsPage() {
  // =========================
  // DATA
  // =========================

  const [entries, setEntries] = useState<GateEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // APPLIED FILTERS
  // =========================

  const [appliedFilters, setAppliedFilters] =
    useState<LPRReportFilterData | null>(null);

  // =========================
  // GET DATA
  // =========================

  useEffect(() => {
    let cancelled = false;

    const loadGateEntries = async () => {
      try {
        console.log("Fetching gate entries...");

        const response = await getGateEntries();

        console.log("Gate entries response:", response);

        if (!cancelled) {
          setEntries(response);
        }
      } catch (error) {
        console.error("Failed to fetch gate entries:", error);

        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGateEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // FILTER FUNCTION
  // =========================

  const filterEntries = (data: GateEntry[], filters: LPRReportFilterData) => {
    return data.filter((entry) => {
      // =========================
      // GATE TYPE
      // =========================

      if (
        filters.gateType !== "all" &&
        entry.entry_type?.toLowerCase() !== filters.gateType.toLowerCase()
      ) {
        return false;
      }

      // =========================
      // PASSING METHOD
      // =========================

      if (
        filters.passingMethod !== "all" &&
        entry.entry_by?.toLowerCase() !== filters.passingMethod.toLowerCase()
      ) {
        return false;
      }

      // =========================
      // PLATE NUMBER
      // =========================

      if (filters.plateNumber?.trim()) {
        const search = filters.plateNumber.trim().toLowerCase();

        const plateNumber = String(entry.plate_number ?? "").toLowerCase();

        if (!plateNumber.includes(search)) {
          return false;
        }
      }

      // =========================
      // RESIDENT NAME
      // =========================

      if (filters.residentName?.trim()) {
        const search = filters.residentName.trim().toLowerCase();

        const residentName = entry.resident?.full_name?.toLowerCase() || "";

        if (!residentName.includes(search)) {
          return false;
        }
      }

      // =========================
      // GATE ID
      // =========================

      if (filters.gateId?.trim()) {
        const gateId = filters.gateId.trim();

        if (String(entry.gate_id) !== gateId) {
          return false;
        }
      }

      // =========================
      // FROM DATE
      // =========================

      if (filters.fromDate) {
        const entryDate = new Date(entry.created_at);

        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);

        if (entryDate < fromDate) {
          return false;
        }
      }

      // =========================
      // TO DATE
      // =========================

      if (filters.toDate) {
        const entryDate = new Date(entry.created_at);

        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);

        if (entryDate > toDate) {
          return false;
        }
      }

      return true;
    });
  };

  // =========================
  // APPLY FILTERS
  // =========================

  const handleApplyFilters = (filters: LPRReportFilterData) => {
    console.log("Applied filters:", filters);

    setAppliedFilters(filters);
    setSelectedId(null);
  };

  // =========================
  // FILTERED DATA
  // =========================

  const filteredEntries = useMemo(() => {
    if (!appliedFilters) {
      return entries;
    }

    return filterEntries(entries, appliedFilters);
  }, [entries, appliedFilters]);

  // =========================
  // EXPORT PDF
  // =========================

  const handleExport = (filters: LPRReportFilterData) => {
    console.log("Export filters:", filters);

    const dataToExport = filterEntries(entries, filters);

    // =========================
    // NO DATA
    // =========================

    if (dataToExport.length === 0) {
      alert("No data available to export.");
      return;
    }

    // =========================
    // CREATE PDF
    // =========================

    const doc = new jsPDF();

    // =========================
    // TITLE
    // =========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text("Gate Entries Report - LPR", 14, 20);

    // =========================
    // TOTAL
    // =========================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Total Entries: ${dataToExport.length}`, 14, 28);

    // =========================
    // TABLE HEADER
    // =========================

    let y = 40;

    const drawHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text("ID", 14, y);
      doc.text("Plate", 30, y);
      doc.text("Type", 65, y);
      doc.text("Entry By", 95, y);
      doc.text("Resident", 130, y);
      doc.text("Gate", 175, y);

      y += 7;

      doc.line(14, y, 195, y);

      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    };

    drawHeader();

    // =========================
    // TABLE DATA
    // =========================

    dataToExport.forEach((entry) => {
      // =========================
      // NEW PAGE
      // =========================

      if (y > 275) {
        doc.addPage();

        y = 20;

        drawHeader();
      }

      // =========================
      // VALUES
      // =========================

      const resident = entry.resident?.full_name || "-";

      const plate = String(entry.plate_number ?? "-");

      const type = entry.entry_type || "-";

      const entryBy = entry.entry_by || "-";

      // =========================
      // ROW
      // =========================

      doc.text(String(entry.id), 14, y);

      doc.text(plate.substring(0, 18), 30, y);

      doc.text(type, 65, y);

      doc.text(entryBy, 95, y);

      doc.text(resident.substring(0, 22), 130, y);

      doc.text(String(entry.gate_id), 175, y);

      y += 7;
    });

    // =========================
    // SAVE PDF
    // =========================

    doc.save("lpr-gate-entries-report.pdf");
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

      <PillTabs tabs={REPORT_TABS} activeValue="/dashboard/reports/lpr" />

      {/* =========================
          FILTERS
      ========================= */}

      <LPRReportFilters onApply={handleApplyFilters} onExport={handleExport} />

      {/* =========================
          RESULT COUNT
      ========================= */}

      {!loading && (
        <div className="px-1 text-sm font-semibold text-[#7C93B4]">
          Showing {filteredEntries.length} of {entries.length} entries
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
            Loading gate entries...
          </div>
        ) : (
          <GateEntriesTable
            data={filteredEntries}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onImageClick={handleImageClick}
          />
        )}
      </div>
    </div>
  );
}
