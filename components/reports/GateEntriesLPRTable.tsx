"use client";

import { useEffect, useMemo, useState } from "react";

import { Car, User, DoorOpen, Calendar, QrCode } from "lucide-react";

import { GateEntry } from "@/services/gateEntry";

type Props = {
  data: GateEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onImageClick: (url: string) => void;
};

export default function GateEntriesTable({
  data,
  selectedId,
  onSelect,
  onImageClick,
}: Props) {
  // =====================================================
  // PAGINATION
  // =====================================================

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // =====================================================
  // RESET PAGE WHEN DATA CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // =====================================================
  // KEEP PAGE VALID
  // =====================================================

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =====================================================
  // CURRENT PAGE DATA
  // =====================================================

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const pages: (number | "...")[] = [];

    // Show all pages if small number
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Always show first page
    pages.push(1);

    // Left ellipsis
    if (currentPage > 3) {
      pages.push("...");
    }

    // Pages around current page
    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // ENTRY TYPE BADGE
  // =====================================================

  const getEntryTypeBadge = (type: GateEntry["entry_type"]) => {
    const isEntry = type.toUpperCase() === "ENTRY";

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1
          text-[16px]
          font-[600]
          ${
            isEntry
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          }
        `}
      >
        <DoorOpen className="h-4 w-4" />

        {isEntry ? "ENTRY" : "EXIT"}
      </span>
    );
  };

  // =====================================================
  // ENTRY BY BADGE
  // =====================================================

  const getEntryByBadge = (method: GateEntry["entry_by"]) => {
    const normalized = method.toUpperCase();

    if (normalized === "NORMAL") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-purple-50
            px-3
            py-1
            text-[16px]
            font-[600]
            text-purple-600
            dark:bg-purple-500/10
            dark:text-purple-400
          "
        >
          <Car className="h-4 w-4" />
          Normal
        </span>
      );
    }

    if (normalized === "PLATE") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-purple-50
            px-3
            py-1
            text-[16px]
            font-[600]
            text-purple-600
            dark:bg-purple-500/10
            dark:text-purple-400
          "
        >
          <Car className="h-4 w-4" />
          Plate
        </span>
      );
    }

    if (normalized === "QR") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-blue-50
            px-3
            py-1
            text-[16px]
            font-[600]
            text-blue-600
            dark:bg-blue-500/10
            dark:text-blue-400
          "
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </span>
      );
    }

    if (normalized === "RESIDENT") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-emerald-50
            px-3
            py-1
            text-[16px]
            font-[600]
            text-emerald-600
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <User className="h-4 w-4" />
          Resident
        </span>
      );
    }

    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-orange-50
          px-3
          py-1
          text-[16px]
          font-[600]
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        "
      >
        <User className="h-4 w-4" />

        {method}
      </span>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        bg-card
        shadow-sm
      "
    >
      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                text-[#7C93B4]
                dark:bg-slate-800/40
              "
            >
              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Plate Number
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Type
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Entry By
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Resident
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Gate
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Time
              </th>
            </tr>
          </thead>

          {/* =====================================================
              BODY
          ===================================================== */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No entries found
                </td>
              </tr>
            ) : (
              paginatedData.map((entry) => {
                const isSelected = selectedId === entry.id;

                return (
                  <tr
                    key={entry.id}
                    onClick={() => onSelect(entry.id)}
                    className={`
                      cursor-pointer
                      border-b
                      border-border
                      transition
                      last:border-b-0
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* =====================================================
                        PLATE
                    ===================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[600] text-foreground dark:text-white">
                          {entry.plate_number || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =====================================================
                        TYPE
                    ===================================================== */}

                    <td className="px-6 py-4">
                      {getEntryTypeBadge(entry.entry_type)}
                    </td>

                    {/* =====================================================
                        ENTRY BY
                    ===================================================== */}

                    <td className="px-6 py-4">
                      {getEntryByBadge(entry.entry_by)}
                    </td>

                    {/* =====================================================
                        RESIDENT
                    ===================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[500] text-[#3B5473] dark:text-white">
                          {entry.resident?.full_name || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =====================================================
                        GATE
                    ===================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[500] text-[#3B5473] dark:text-white">
                          Gate {entry.gate_id}
                        </span>
                      </div>
                    </td>

                    {/* =====================================================
                        TIME
                    ===================================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#29C5E8]" />

                        <span className="whitespace-nowrap text-[18px] font-[500] text-[#3B5473] dark:text-white">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {data.length > 0 && totalPages > 1 && (
        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-border
            px-6
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* =====================================================
              RESULTS INFO
          ===================================================== */}

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{data.length}</span>{" "}
            entries
          </div>

          {/* =====================================================
              PAGINATION BUTTONS
          ===================================================== */}

          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="
                flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-lg
                border
                border-border
                px-3
                text-sm
                font-medium
                text-foreground
                transition
                hover:bg-secondary
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        text-sm
                        text-muted-foreground
                      "
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = currentPage === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      text-sm
                      font-semibold
                      transition
                      ${
                        isCurrent
                          ? "border-brand bg-brand text-[#132f49]"
                          : "border-border text-foreground hover:bg-secondary"
                      }
                    `}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="
                flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-lg
                border
                border-border
                px-3
                text-sm
                font-medium
                text-foreground
                transition
                hover:bg-secondary
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
