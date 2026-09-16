"use client";

import { useMemo, useState, useEffect } from "react";
import {
  HiOutlineClock,
  HiOutlineXCircle,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePhotograph,
} from "react-icons/hi";
import type { GateEntry } from "@/modules/types/gateEntry";

type GateEntriesTableProps = {
  entries: GateEntry[];
  selectedGate: { id: number; name: string } | null;
  loadingEntries: boolean;
  getGateName: (gateId: number) => string;
  getEntryTypeColor: (type?: string | null) => string;
  onRefresh: () => void | Promise<void>;
};

const ITEMS_PER_PAGE = 10;

export default function GateEntriesTable({
  entries,
  selectedGate,
  loadingEntries,
  getGateName,
  getEntryTypeColor,
  onRefresh,
}: GateEntriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ===== فلترة حسب البوابة المختارة =====
  const filteredEntries = useMemo(() => {
    if (!selectedGate) return entries;
    return entries.filter((entry) => entry.gate_id === selectedGate.id);
  }, [entries, selectedGate]);

  // ===== إعادة الترقيم لأول صفحة عند تغيير الفلتر =====
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGate?.id, entries.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEntries = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, safeCurrentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setCurrentPage(1);
    await onRefresh();
  };

  const startEntry =
    filteredEntries.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endEntry = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredEntries.length,
  );

  // ===== تنسيق التاريخ =====
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6 mt-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold flex items-center gap-2 text-lg">
          <HiOutlineClock className="w-5 h-5" />
          {selectedGate
            ? `Entries for ${selectedGate.name}`
            : "Gate Entry Logs"}
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-[16px] font-[700] text-[#0E2038] dark:text-white">
            Total: {filteredEntries.length} entries
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingEntries}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg disabled:opacity-50"
            aria-label="Refresh logs"
          >
            ↻
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b border-border bg-[#F2F6FB] dark:bg-slate-800/40 text-[#7C93B4]">
              <th className="px-4 py-4 text-base font-bold text-left">ID</th>
              <th className="px-4 py-4 text-base font-bold text-left">Time</th>
              <th className="px-4 py-4 text-base font-bold text-left">Gate</th>
              <th className="px-4 py-4 text-base font-bold text-left">Plate</th>
              <th className="px-4 py-4 text-base font-bold text-left">
                Entry Type
              </th>
              <th className="px-4 py-4 text-base font-bold text-left">
                Entry By
              </th>
              <th className="px-4 py-4 text-base font-bold text-left">
                Resident
              </th>
              <th className="px-4 py-4 text-base font-bold text-left">Image</th>
            </tr>
          </thead>

          <tbody>
            {loadingEntries ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg text-muted-foreground">
                      Loading entries from API...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-lg text-muted-foreground"
                >
                  <HiOutlineXCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {selectedGate
                    ? `No entries found for ${selectedGate.name}`
                    : "No entries available yet"}
                </td>
              </tr>
            ) : (
              paginatedEntries.map((entry) => {
                const plateNumber = entry.plate_number ?? "—";
                const entryBy = entry.entry_by ?? "—";
                const entryType = entry.entry_type ?? "UNKNOWN";

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border transition last:border-b-0 hover:bg-secondary dark:hover:bg-slate-800/50"
                  >
                    {/* ID */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-slate-800/50 text-[#3B5473] dark:text-white border border-border">
                        #{entry.id}
                      </span>
                    </td>

                    {/* TIME */}
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-mono text-[#3B5473] dark:text-white whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </span>
                    </td>

                    {/* GATE */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-foreground dark:text-white">
                          {getGateName(entry.gate_id)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          ID: {entry.gate_id}
                        </span>
                      </div>
                    </td>

                    {/* PLATE */}
                    <td className="px-4 py-3">
                      <span
                        dir="rtl"
                        className={`font-mono text-[14px] font-semibold whitespace-nowrap ${
                          plateNumber === "—"
                            ? "text-muted-foreground"
                            : "text-[#10b981]"
                        }`}
                      >
                        {plateNumber}
                      </span>
                    </td>

                    {/* ENTRY TYPE */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border ${getEntryTypeColor(
                          entry.entry_type,
                        )}`}
                      >
                        {entryType}
                      </span>
                    </td>

                    {/* ENTRY BY */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border ${
                          entryBy === "QR"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : entryBy === "NORMAL"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}
                      >
                        {entryBy}
                      </span>
                    </td>

                    {/* RESIDENT */}
                    <td className="px-4 py-3">
                      {entry.resident ? (
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#3B5473] dark:text-white">
                            {entry.resident.full_name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ID: {entry.resident.id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[13px] text-muted-foreground italic">
                          No Resident
                        </span>
                      )}
                    </td>

                    {/* IMAGE */}
                    <td className="px-4 py-3">
                      {entry.image_url ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(entry.image_url!)}
                          className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 text-[12px] font-medium"
                        >
                          <HiOutlinePhotograph className="w-4 h-4" />
                          View
                        </button>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {!loadingEntries && filteredEntries.length > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{startEntry}</span>{" "}
            - <span className="font-semibold text-foreground">{endEntry}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filteredEntries.length}
            </span>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                  safeCurrentPage === page
                    ? "bg-brand text-white"
                    : "border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {selectedGate
            ? `Showing ${filteredEntries.length} entries for ${selectedGate.name}`
            : `Total entries: ${entries.length}`}
        </span>
      </div>

      {/* ===== IMAGE PREVIEW MODAL ===== */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Entry"
              className="max-w-full max-h-[85vh] rounded-lg"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
