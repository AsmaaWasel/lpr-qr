"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

/* =========================================================
   SectionCard — the white rounded container every page uses
========================================================= */

export function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`voom-card-flush ${className}`}>{children}</section>
  );
}

/* =========================================================
   StatCard + StatRow
   First card in a row is the dark navy "hero" card.
========================================================= */

export function StatCard({
  label,
  value,
  hero = false,
}: {
  label: string;
  value: React.ReactNode;
  hero?: boolean;
}) {
  return (
    <div
      className={`voom-stat  min-h-[130px] ${hero ? "voom-stat--hero" : ""}`}
    >
      <p className="voom-stat-label  text-lg font-semibold">{label}</p>
      <p className="voom-stat-value">{value}</p>
    </div>
  );
}

export function StatRow({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          hero={index === 0}
        />
      ))}
    </section>
  );
}

/* =========================================================
   PillTabs — works with hrefs (routing) or onChange (local)
========================================================= */

export type PillTab = {
  label: string;
  href?: string;
  value?: string;
};

export function PillTabs({
  tabs,
  activeValue,
  onChange,
}: {
  tabs: PillTab[];
  activeValue: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const value = tab.value ?? tab.href ?? tab.label;
        const active = value === activeValue;

        const className = `
          voom-tab
          text-[15px]
          font-[600]
          px-5
          py-2.5
          rounded-xl
          ${active ? "bg-[#16324F] text-white" : "bg-white text-[#16324F]"}
        `;

        if (tab.href) {
          return (
            <Link key={value} href={tab.href} className={className}>
              {tab.label}
            </Link>
          );
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange?.(value)}
            className={className}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   Toolbar — search + Add / Edit / Delete
   `extraActions` covers pages with a second primary button
   (e.g. Residents has "Add Credentials").
========================================================= */

export function Toolbar({
  search,
  onSearchChange,
  placeholder = "Search...",
  addLabel,
  onAdd,
  onEdit,
  onDelete,
  hasSelected = false,
  extraActions,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasSelected?: boolean;
  extraActions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="
            voom-input
            voom-input--search
            h-15
            text-lg
            text-black
            placeholder:font-semibold
            placeholder:text-[#8f9aaa]
            focus:outline-none
            focus:ring-0
            focus:border-border
          "
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="
  rounded-xl
  px-5
  py-2.5
  text-[16px]
  font-[600]
  text-[##0B1B30]
  transition-all
  hover:opacity-90
  bg-gradient-to-br
  from-[#38bdf8]
  to-[#3b82f6]
"
          >
            {addLabel ?? "Add"}
          </button>
        )}

        {extraActions}

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            disabled={!hasSelected}
            className="voom-btn voom-btn--ghost text-[600] text-[16px] text-[#3B5473] bg-[#F2F6FB]"
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={!hasSelected}
            className="voom-btn voom-btn--danger text-[600] text-[16px] text-[#D64B68] bg-[##FCEDF0]"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Chip — status / type badges
========================================================= */

type ChipTone = "brand" | "ink" | "ok" | "warn" | "danger" | "muted";

export function Chip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: ChipTone;
}) {
  return <span className={`voom-chip voom-chip--${tone}`}>{children}</span>;
}

/* Maps the domain values in this system to a tone, so tables
   don't each hand-pick colors. */
const TONE_BY_STATUS: Record<string, ChipTone> = {
  ENTRY: "brand",
  EXIT: "ink",
  ALLOWED: "ok",
  ACTIVE: "ok",
  ONLINE: "ok",
  PENDING: "warn",
  DEGRADED: "warn",
  "NOT ALLOWED": "danger",
  BLOCKED: "danger",
  OFFLINE: "danger",
  SUPERADMIN: "brand",
  ADMIN: "brand",
  MANAGER: "muted",
  SECURITY: "ok",
  IT: "warn",
  OWNER: "brand",
  TENANT: "muted",
  PLATE: "brand",
  QR: "muted",
};

export function StatusChip({ value }: { value: string }) {
  const key = value.trim().toUpperCase();
  return <Chip tone={TONE_BY_STATUS[key] ?? "muted"}>{value}</Chip>;
}

/* =========================================================
   Mono — technical values (IP, port, URL, timestamp)
========================================================= */

export function Mono({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="voom-mono-link"
      >
        {children}
      </a>
    );
  }

  return <span className="voom-mono">{children}</span>;
}

/* =========================================================
   CellTitle — bold name with a muted subtitle underneath
========================================================= */

export function CellTitle({
  title,
  subtitle,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div>
      <div className="voom-cell-title">{title}</div>
      {subtitle && <div className="voom-cell-sub">{subtitle}</div>}
    </div>
  );
}

/* =========================================================
   Pagination
========================================================= */

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = "items",
  onPrevious,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="voom-pagination">
      <p className="voom-pagination-info text-lg">
        Page {currentPage} of {totalPages} · {totalItems} {itemLabel}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage <= 1}
          className="voom-page-btn text-lg"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="voom-page-btn text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CrudShell — the standard page shape in this system:
   tabs → stats → card{ toolbar, table, pagination }
   Used by gates, cameras, plates, users, residents,
   departments, visitors and QR readers.
========================================================= */

export function CrudShell({
  tabs,
  activeTab,
  stats,
  search,
  onSearchChange,
  searchPlaceholder,
  addLabel,
  onAdd,
  onEdit,
  onDelete,
  hasSelected,
  extraActions,
  currentPage,
  totalPages,
  totalItems,
  itemLabel,
  onPrevious,
  onNext,
  children,
}: {
  tabs?: PillTab[];
  activeTab?: string;
  stats?: { label: string; value: React.ReactNode }[];
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasSelected?: boolean;
  extraActions?: React.ReactNode;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
  onPrevious: () => void;
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {tabs && tabs.length > 0 && (
        <PillTabs tabs={tabs} activeValue={activeTab ?? ""} />
      )}

      {stats && stats.length > 0 && <StatRow items={stats} />}

      <SectionCard>
        <Toolbar
          search={search}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
          addLabel={addLabel}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          hasSelected={hasSelected}
          extraActions={extraActions}
        />

        {children}

        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          totalItems={totalItems}
          itemLabel={itemLabel}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </SectionCard>
    </div>
  );
}

/* Tab sets shared across the LPR and QR modules */

export const LPR_TABS: PillTab[] = [
  { label: "Real Time Gates", href: "/dashboard/lpr/real-time" },
  { label: "Gates", href: "/dashboard/lpr/gates" },
  { label: "Cameras", href: "/dashboard/lpr/cameras" },
  { label: "Plates", href: "/dashboard/lpr/plates" },
];

export const QR_TABS: PillTab[] = [
  { label: "QR Generator", href: "/dashboard/qr/qr-generator" },
  { label: "QR Readers", href: "/dashboard/qr/qr-readers" },
];

export const REPORT_TABS: PillTab[] = [
  { label: "LPR Reports", href: "/dashboard/reports/lpr" },
  { label: "QR Reports", href: "/dashboard/reports/qr" },
];
