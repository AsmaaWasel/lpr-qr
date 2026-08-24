"use client";

import { useState } from "react";
import { Filter, Download } from "lucide-react";

export type ReportFilterData = {
  gateType: string;
  passingMethod: string;
  plateNumber: string;
  residentName: string;
  gateId: string;
  fromDate: string;
  toDate: string;
};

type ReportFiltersProps = {
  onApply?: (filters: ReportFilterData) => void;
  onExport?: (filters: ReportFilterData) => void;
};

const initialFilters: ReportFilterData = {
  gateType: "all",
  passingMethod: "all",
  plateNumber: "",
  residentName: "",
  gateId: "",
  fromDate: "",
  toDate: "",
};

export default function ReportLPRFilters({
  onApply,
  onExport,
}: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilterData>(initialFilters);

  const updateFilter = (key: keyof ReportFilterData, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleExport = () => {
    onExport?.(filters);
  };

  return (
    <div
      className="
        w-full
        rounded-[24px]
        bg-card
        p-5
        shadow-sm
        md:p-6
      "
    >
      {/* =========================
          HEADER
      ========================== */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={20} strokeWidth={2} className="text-brand-strong" />

          <h2
            className="
              text-lg
              font-bold
              text-foreground
            "
          >
            Filters
          </h2>
        </div>

        {/* =========================
            ACTIONS
        ========================== */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="
              rounded-xl
              bg-accent
              px-5
              py-2.5
              text-sm
              font-bold
              text-brand-strong
              transition-all
              hover:opacity-90
              active:scale-[0.98]
              dark:bg-cyan-500/10
              dark:text-cyan-400
            "
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-xl
              bg-emerald-50
              px-5
              py-2.5
              text-sm
              font-bold
              text-emerald-600
              transition-all
              hover:bg-emerald-100
              active:scale-[0.98]
              dark:bg-emerald-500/10
              dark:text-emerald-400
              dark:hover:bg-emerald-500/20
            "
          >
            Export
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* =========================
          FILTERS
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          gap-x-4
          gap-y-4
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        {/* Gate Type */}
        <FilterField label="Gate Type">
          <select
            value={filters.gateType}
            onChange={(e) => updateFilter("gateType", e.target.value)}
            className="report-filter-input"
          >
            <option value="all">All</option>
            <option value="entry">Entry</option>
            <option value="exit">Exit</option>
          </select>
        </FilterField>

        {/* Passing Method */}
        <FilterField label="Passing Method">
          <select
            value={filters.passingMethod}
            onChange={(e) => updateFilter("passingMethod", e.target.value)}
            className="report-filter-input"
          >
            <option value="all">All</option>
            <option value="plate">Plate</option>
            <option value="qr">QR</option>
          </select>
        </FilterField>

        {/* Plate Number */}
        <FilterField label="Plate Number">
          <input
            type="text"
            value={filters.plateNumber}
            onChange={(e) => updateFilter("plateNumber", e.target.value)}
            placeholder="Search plate..."
            className="report-filter-input"
          />
        </FilterField>

        {/* Resident Name */}
        <FilterField label="Resident Name">
          <input
            type="text"
            value={filters.residentName}
            onChange={(e) => updateFilter("residentName", e.target.value)}
            placeholder="Search resident name..."
            className="report-filter-input"
          />
        </FilterField>

        {/* Gate ID */}
        <FilterField label="Gate ID">
          <input
            type="text"
            value={filters.gateId}
            onChange={(e) => updateFilter("gateId", e.target.value)}
            placeholder="Gate ID..."
            className="report-filter-input"
          />
        </FilterField>

        {/* From Date */}
        <FilterField label="From Date">
          <input
            type="datetime-local"
            value={filters.fromDate}
            onChange={(e) => updateFilter("fromDate", e.target.value)}
            className="report-filter-input"
          />
        </FilterField>

        {/* To Date */}
        <FilterField label="To Date">
          <input
            type="datetime-local"
            value={filters.toDate}
            onChange={(e) => updateFilter("toDate", e.target.value)}
            className="report-filter-input"
          />
        </FilterField>
      </div>

      {/* =========================
          LOCAL STYLES
      ========================== */}
      <style jsx>{`
        .report-filter-input {
          width: 100%;
          height: 50px;
          border-radius: 12px;
          border: 1px solid hsl(var(--border));
          background: #edf3f9;
          padding: 0 14px;
          font-size: 14px;
          font-weight: 500;
          color: #466080;
          outline: none;
          transition: all 0.2s ease;
        }

        .report-filter-input::placeholder {
          color: #8195b2;
          font-weight: 600;
        }

        .report-filter-input:focus {
          border-color: #b8d9f5;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.08);
        }

        .report-filter-input option {
          background: white;
          color: #132f49;
        }

        @media (prefers-color-scheme: dark) {
          .report-filter-input {
            background: rgba(30, 41, 59, 0.65);
            color: #e2e8f0;
            border-color: rgba(71, 85, 105, 0.7);
          }

          .report-filter-input::placeholder {
            color: #94a3b8;
          }

          .report-filter-input option {
            background: #1e293b;
            color: #e2e8f0;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   FILTER FIELD
========================================================= */

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="
          text-sm
          font-bold
          text-[#3f5c80]
          dark:text-slate-300
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}
