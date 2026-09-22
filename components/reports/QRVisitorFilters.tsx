"use client";

import { useState } from "react";
import {
  Filter,
  Download,
  User,
  Phone,
  IdCard,
  Calendar,
  Car,
} from "lucide-react";

import { FilterField } from "./FilterFunction";

export type QRReportFilterData = {
  qrCodeId: string;
  visitorName: string;
  visitorNationalId: string;
  visitorPhone: string;
  residentName: string;
  residentNationalId: string;
  residentPhone: string;
  plateNumber: string;
  status: string;
  fromDate: string;
  toDate: string;
};

type QRReportFiltersProps = {
  onApply?: (filters: QRReportFilterData) => void;
  onExport?: (filters: QRReportFilterData) => void;
};

const initialFilters: QRReportFilterData = {
  qrCodeId: "",
  visitorName: "",
  visitorNationalId: "",
  visitorPhone: "",
  residentName: "",
  residentNationalId: "",
  residentPhone: "",
  plateNumber: "",
  status: "all",
  fromDate: "",
  toDate: "",
};

export default function QRReportFilters({
  onApply,
  onExport,
}: QRReportFiltersProps) {
  const [filters, setFilters] = useState<QRReportFilterData>(initialFilters);

  const updateFilter = (key: keyof QRReportFilterData, value: string) => {
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

          <h2 className="text-lg font-bold text-foreground">
            QR Visitor Filters
          </h2>
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
        {/* QR Code ID */}
        {/* <FilterField label="QR Code ID">
          <div className="relative">
            <input
              type="text"
              value={filters.qrCodeId}
              onChange={(e) => updateFilter("qrCodeId", e.target.value)}
              placeholder="Search QR Code ID..."
              className={`${inputClassName} pl-10`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8195b2] text-lg font-bold">
              #
            </span>
          </div>
        </FilterField> */}

        {/* Visitor Name */}
        <FilterField label="Visitor Name">
          <div className="relative">
            <input
              type="text"
              value={filters.visitorName}
              onChange={(e) => updateFilter("visitorName", e.target.value)}
              placeholder="Search visitor name..."
              className={`${inputClassName} pl-10`}
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Visitor National ID */}
        <FilterField label="Visitor National ID">
          <div className="relative">
            <input
              type="text"
              value={filters.visitorNationalId}
              onChange={(e) =>
                updateFilter("visitorNationalId", e.target.value)
              }
              placeholder="Search visitor national ID..."
              className={`${inputClassName} pl-10`}
            />
            <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

        {/* Visitor Phone */}
        <FilterField label="Visitor Phone">
          <div className="relative">
            <input
              type="text"
              value={filters.visitorPhone}
              onChange={(e) => updateFilter("visitorPhone", e.target.value)}
              placeholder="Search visitor phone..."
              className={`${inputClassName} pl-10`}
            />
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
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

        {/* Resident National ID */}
        {/* <FilterField label="Resident National ID">
          <div className="relative">
            <input
              type="text"
              value={filters.residentNationalId}
              onChange={(e) =>
                updateFilter("residentNationalId", e.target.value)
              }
              placeholder="Search resident national ID..."
              className={`${inputClassName} pl-10`}
            />
            <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField> */}

        {/* Resident Phone */}
        <FilterField label="Resident Phone">
          <div className="relative">
            <input
              type="text"
              value={filters.residentPhone}
              onChange={(e) => updateFilter("residentPhone", e.target.value)}
              placeholder="Search resident phone..."
              className={`${inputClassName} pl-10`}
            />
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8195b2]" />
          </div>
        </FilterField>

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

        {/* Status */}
        <FilterField label="Status">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className={`${selectClassName} pl-10`}
            >
              <option value="all">All Status</option>
              <option value="entered">Entered</option>
              <option value="exited">Exited</option>
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8195b2] text-lg">
              ●
            </span>
          </div>
        </FilterField>

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
