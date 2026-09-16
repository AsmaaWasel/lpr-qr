"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Car,
  User,
  Calendar,
  QrCode,
  LogIn,
  LogOut,
  IdCard,
  Phone,
} from "lucide-react";

import { VisitorLog } from "@/services/visitorLogs";

type Props = {
  data: VisitorLog[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onImageClick: (url: string) => void;
};

export default function QRVisitorLogsTable({
  data,
  selectedId,
  onSelect,
  onImageClick,
}: Props) {
  // =========================
  // PAGINATION
  // =========================

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Reset to first page whenever filters/data change
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Prevent invalid page after data becomes smaller
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  // =========================
  // PAGE NUMBERS
  // =========================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const pages: (number | "...")[] = [];

    // Show all pages if 7 or less
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

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "-";
    }

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

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "entered") {
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
            text-xs
            font-[600]
            text-emerald-600
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <LogIn className="h-3.5 w-3.5" />
          Entered
        </span>
      );
    }

    if (normalized === "exited") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-red-50
            px-3
            py-1
            text-xs
            font-[600]
            text-red-600
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          <LogOut className="h-3.5 w-3.5" />
          Exited
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
          text-xs
          font-[600]
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        "
      >
        {status}
      </span>
    );
  };

  // =========================
  // GET PHONE NUMBER
  // =========================

  const getPhoneNumber = (resident: any) => {
    if (!resident) {
      return "-";
    }

    if (resident.phone_numbers && resident.phone_numbers.length > 0) {
      return resident.phone_numbers[0].phone_number;
    }

    return "-";
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        bg-card
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          {/* =========================
              HEADER
          ========================= */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                dark:bg-slate-800/40
              "
            >
              {/* QR Code */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                QR Code
              </th>

              {/* Visitor */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor
              </th>

              {/* Visitor National ID */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor National ID
              </th>

              {/* Visitor Phone */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor Phone
              </th>

              {/* Resident */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Resident
              </th>

              {/* Resident Phone */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Resident Phone
              </th>

              {/* Plate Number */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Plate Number
              </th>

              {/* Status */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Status
              </th>

              {/* Created By */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Created By
              </th>

              {/* Entry Time */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Entry Time
              </th>

              {/* Exit Time */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Exit Time
              </th>
            </tr>
          </thead>

          {/* =========================
              BODY
          ========================= */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  <div className="flex flex-col items-center gap-3">
                    <QrCode
                      className="
                        h-10
                        w-10
                        text-muted-foreground
                      "
                    />

                    <p className="text-lg font-medium">
                      No QR visitor logs found
                    </p>

                    <p className="text-lg text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((log) => {
                const isSelected = selectedId === log.id;

                return (
                  <tr
                    key={log.id}
                    onClick={() => onSelect(log.id)}
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
                    {/* =========================
                        QR CODE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <QrCode
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-foreground
                              dark:text-white
                            "
                          >
                            {log.qr_code_id ? `QR #${log.qr_code_id}` : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <User
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-foreground
                              dark:text-white
                            "
                          >
                            {log.visitor_full_name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR NATIONAL ID
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <IdCard
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.visitor_national_id || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR PHONE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.visitor_phone_number || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        RESIDENT
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <User
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-[#3B5473]
                              dark:text-white
                            "
                          >
                            {log.resident?.full_name || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        RESIDENT PHONE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {getPhoneNumber(log.resident)}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        PLATE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Car
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            font-mono
                            text-[18px]
                            font-[600]
                            text-foreground
                            dark:text-white
                          "
                        >
                          {log.plate_number || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        STATUS
                    ========================= */}

                    <td className="px-6 py-4">{getStatusBadge(log.status)}</td>

                    {/* =========================
                        CREATED BY
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.created_by?.name || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        ENTRY TIME
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {formatDate(log.entry_time)}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        EXIT TIME
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {formatDate(log.exit_time)}
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

      {/* =========================
          PAGINATION
      ========================= */}

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
          {/* Results Info */}

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

          {/* Pagination Controls */}

          <div className="flex items-center gap-1">
            {/* Previous */}

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

            {/* Page Numbers */}

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

            {/* Next */}

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
