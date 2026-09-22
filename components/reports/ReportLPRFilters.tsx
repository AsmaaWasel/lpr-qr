"use client";

import { useState } from "react";
import {
  Filter,
  Download,
  Car,
  User,
  Hash,
  Calendar,
  DoorOpen,
} from "lucide-react";

import { FilterField } from "./FilterFunction";

export type LPRReportFilterData = {
  plateNumber: string;
  residentName: string;
  gateType: string;
  passingMethod: string;
  gateId: string;
  fromDate: string;
  toDate: string;
};

type LPRReportFiltersProps = {
  onApply?: (filters: LPRReportFilterData) => void;
  onExport?: (filters: LPRReportFilterData) => void;
};

const initialFilters: LPRReportFilterData = {
  plateNumber: "",
  residentName: "",
  gateType: "all",
  passingMethod: "all",
  gateId: "",
  fromDate: "",
  toDate: "",
};

export default function LPRReportFilters({
  onApply,
  onExport,
}: LPRReportFiltersProps) {
  const [filters, setFilters] = useState<LPRReportFilterData>(initialFilters);

  const updateFilter = (key: keyof LPRReportFilterData, value: string) => {
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

  const inputClassName = `
    w-full
    h-[50px]
    rounded-xl
    border
    border-border
    bg-[#edf3f9]
    px-[14px]
    text-sm
    font-medium
    text-[#466080]
    outline-none
    transition-all
    duration-200
    focus:border-[#b8d9f5]
    focus:shadow-[0_0_0_2px_rgba(56,189,248,0.08)]
    dark:bg-[rgba(30,41,59,0.65)]
    dark:text-[#e2e8f0]
    dark:border-[rgba(71,85,105,0.7)]
    [&::placeholder]:text-[#8195b2]
    [&::placeholder]:font-semibold
    dark:[&::placeholder]:text-[#94a3b8]
  `;

  const selectClassName = `
    w-full
    h-[50px]
    rounded-xl
    border
    border-border
    bg-[#edf3f9]
    px-[14px]
    text-sm
    font-medium
    text-[#466080]
    outline-none
    transition-all
    duration-200
    focus:border-[#b8d9f5]
    focus:shadow-[0_0_0_2px_rgba(56,189,248,0.08)]
    dark:bg-[rgba(30,41,59,0.65)]
    dark:text-[#e2e8f0]
    dark:border-[rgba(71,85,105,0.7)]
    cursor-pointer
    appearance-none
  `;

  return (
    <div className="w-full rounded-[24px] bg-card p-5 shadow-sm md:p-6">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={20} strokeWidth={2} className="text-brand-strong" />

          <h2 className="text-lg font-bold text-foreground">LPR Filters</h2>
        </div>

        {/* ACTIONS */}
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

      {/* FILTERS */}
      <div
        className="
          grid
          grid-cols-1
          gap-x-4
          gap-y-4
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {/* Plate Number */}
        <FilterField label="Plate Number">
          <div className="relative">
            <input
              type="text"
              value={filters.plateNumber}
              onChange={(e) => updateFilter("plateNumber", e.target.value)}
              placeholder="Search plate number..."
              className={`${inputClassName} pl-10`}
            />
            <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Resident Name */}
        <FilterField label="Resident Name">
          <div className="relative">
            <input
              type="text"
              value={filters.residentName}
              onChange={(e) => updateFilter("residentName", e.target.value)}
              placeholder="Search resident name..."
              className={`${inputClassName} pl-10`}
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Gate Type */}
        <FilterField label="Gate Type">
          <div className="relative">
            <select
              value={filters.gateType}
              onChange={(e) => updateFilter("gateType", e.target.value)}
              className={`${selectClassName} pl-10`}
            >
              <option value="all">All Types</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </select>
            <DoorOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Passing Method */}
        <FilterField label="Passing Method">
          <div className="relative">
            <select
              value={filters.passingMethod}
              onChange={(e) => updateFilter("passingMethod", e.target.value)}
              className={`${selectClassName} pl-10`}
            >
              <option value="all">All Methods</option>
              <option value="normal">Normal</option>
              <option value="plate">Plate</option>
              <option value="qr">QR Code</option>
              <option value="resident">Resident</option>
            </select>
            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Gate ID */}
        {/* <FilterField label="Gate ID">
          <div className="relative">
            <input
              type="text"
              value={filters.gateId}
              onChange={(e) => updateFilter("gateId", e.target.value)}
              placeholder="Enter gate ID..."
              className={`${inputClassName} pl-10`}
            />
            <DoorOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField> */}

        {/* From Date */}
        <FilterField label="From Date">
          <div className="relative">
            <input
              type="datetime-local"
              value={filters.fromDate}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              className={`${inputClassName} pl-10`}
            />
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* To Date */}
        <FilterField label="To Date">
          <div className="relative">
            <input
              type="datetime-local"
              value={filters.toDate}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              className={`${inputClassName} pl-10`}
            />
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>
      </div>
    </div>
  );
}
