// components/VisitorLogsManager.tsx
"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  QrCode,
  User,
  DoorOpen,
  DoorClosed,
  Calendar,
  Image as ImageIcon,
  Filter,
  X,
  Loader2,
  FileSpreadsheet,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ChevronDown,
  FileText,
  File,
  Save,
  Eye,
} from "lucide-react";

import Link from "next/link";

import api from "@/services/api";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ======================================================
// TYPES
// ======================================================

type ResidentSimple = {
  id: number;
  full_name: string;
};

type VisitorLogStatus = "not_used" | "active" | "completed" | "expired";

type VisitorLog = {
  id: number;
  qr_code_id: number;
  resident_id: number;

  resident?: ResidentSimple | null;

  image_url: string;
  plate_number?: string;

  entry_time: string;
  exit_time: string | null;

  status: VisitorLogStatus;

  created_at: string;
};

type FilterParams = {
  status?: VisitorLogStatus;
  resident_id?: number;
  qr_code_id?: number;
  plate_number?: string;
  from_date?: string;
  to_date?: string;
  has_exit?: boolean;
};

type LocalFilterParams = FilterParams & {
  resident_name?: string;
};

type ExportFormat = "excel" | "pdf" | "csv";

// ======================================================
// COMPONENT
// ======================================================

export default function VisitorLogsManager() {
  // ====================================================
  // STATE
  // ====================================================

  const [data, setData] = useState<VisitorLog[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterParams>({});

  const [localFilters, setLocalFilters] = useState<LocalFilterParams>({});

  const [imageModal, setImageModal] = useState<{
    open: boolean;
    url: string;
  }>({
    open: false,
    url: "",
  });

  const [exporting, setExporting] = useState(false);

  const [exportSuccess, setExportSuccess] = useState(false);

  const [showExportMenu, setShowExportMenu] = useState(false);

  const [savingFilters, setSavingFilters] = useState(false);

  // ====================================================
  // API
  // ====================================================

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const API = `${API_BASE}`;

  // ====================================================
  // FETCH LOGS
  // ====================================================

  const fetchLogs = async (filterParams?: FilterParams) => {
    try {
      setLoading(true);

      const params = filterParams ?? filters;

      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== "" && value !== null,
        ),
      );

      const queryParams = {
        skip: 0,
        limit: 100,
        ...cleanedParams,
      };

      const response = await api.get(`${API}/visitor-logs/`, {
        params: queryParams,
      });

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setData(responseData);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch visitor logs:", err);

      setError("Failed to fetch visitor logs");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // APPLY FILTERS
  // ====================================================

  const applyFilters = (newFilters: LocalFilterParams) => {
    const { resident_name: _residentName, ...apiFilters } = newFilters;

    setFilters(apiFilters);

    fetchLogs(apiFilters);
  };

  // ====================================================
  // RESET FILTERS
  // ====================================================

  const resetFilters = () => {
    const emptyFilters: LocalFilterParams = {};

    setFilters({});

    setLocalFilters(emptyFilters);

    fetchLogs({});
  };

  // ====================================================
  // SAVE FILTERS
  // ====================================================

  const saveFilters = () => {
    try {
      setSavingFilters(true);

      const filtersToSave = {
        ...localFilters,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("visitorLogsFilters", JSON.stringify(filtersToSave));

      applyFilters(localFilters);

      setTimeout(() => {
        setSavingFilters(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving filters:", error);

      setSavingFilters(false);
    }
  };

  // ====================================================
  // LOAD SAVED FILTERS
  // ====================================================

  const loadSavedFilters = () => {
    try {
      const saved = localStorage.getItem("visitorLogsFilters");

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as LocalFilterParams & {
        savedAt?: string;
      };

      const { savedAt: _savedAt, ...filtersData } = parsed;

      setLocalFilters(filtersData);

      applyFilters(filtersData);
    } catch (error) {
      console.error("Error loading saved filters:", error);
    }
  };

  // ====================================================
  // FILTERED DATA
  // ====================================================

  const filteredData = data.filter((log) => {
    const residentName = log.resident?.full_name?.toLowerCase() || "";

    const searchName = localFilters.resident_name?.trim().toLowerCase() || "";

    if (searchName && !residentName.includes(searchName)) {
      return false;
    }

    return true;
  });

  // ====================================================
  // EXPORT DATA
  // ====================================================

  const getExportData = (): VisitorLog[] => {
    return filteredData;
  };

  // ====================================================
  // EXPORT SUCCESS
  // ====================================================

  const showExportSuccess = () => {
    setExportSuccess(true);

    setTimeout(() => {
      setExportSuccess(false);
    }, 3000);
  };

  // ====================================================
  // FORMAT STATUS
  // ====================================================

  const getStatusLabel = (status: VisitorLogStatus) => {
    switch (status) {
      case "not_used":
        return "Not Used";

      case "active":
        return "Active";

      case "completed":
        return "Completed";

      case "expired":
        return "Expired";

      default:
        return "Unknown";
    }
  };

  // ====================================================
  // EXPORT EXCEL
  // ====================================================

  const exportToExcel = () => {
    try {
      setExporting(true);

      const exportData = getExportData();

      if (exportData.length === 0) {
        alert("No data to export");

        setExporting(false);

        return;
      }

      const excelData = exportData.map((log) => ({
        ID: log.id,

        Status: getStatusLabel(log.status),

        "QR Code ID": log.qr_code_id,

        "Resident Name": log.resident?.full_name || "N/A",

        "Resident ID": log.resident_id || "N/A",

        "Plate Number": log.plate_number || "N/A",

        "Entry Time": log.entry_time
          ? new Date(log.entry_time).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "N/A",

        "Exit Time": log.exit_time
          ? new Date(log.exit_time).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "Not exited",

        "Created At": new Date(log.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),

        "Image URL": log.image_url || "No image",
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);

      ws["!cols"] = [
        { wch: 8 },
        { wch: 14 },
        { wch: 14 },
        { wch: 25 },
        { wch: 14 },
        { wch: 18 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 40 },
      ];

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Visitor Logs");

      const now = new Date();

      const dateStr = now.toISOString().split("T")[0];

      XLSX.writeFile(wb, `visitor-logs_${dateStr}.xlsx`);

      showExportSuccess();
    } catch (err) {
      console.error("Error exporting to Excel:", err);

      alert("Failed to export data to Excel");
    } finally {
      setExporting(false);

      setShowExportMenu(false);
    }
  };

  // ====================================================
  // EXPORT PDF
  // ====================================================

  const exportToPDF = () => {
    try {
      setExporting(true);

      const exportData = getExportData();

      if (exportData.length === 0) {
        alert("No data to export");

        setExporting(false);

        return;
      }

      const doc = new jsPDF("landscape", "mm", "a4");

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(16);

      doc.setTextColor(33, 33, 33);

      doc.text("Visitor Logs Report", pageWidth / 2, 15, {
        align: "center",
      });

      const now = new Date();

      doc.setFontSize(10);

      doc.setTextColor(100, 100, 100);

      doc.text(`Generated: ${now.toLocaleString("en-US")}`, pageWidth / 2, 22, {
        align: "center",
      });

      doc.text(`Total Visitor Logs: ${exportData.length}`, pageWidth / 2, 29, {
        align: "center",
      });

      const tableData = exportData.map((log) => [
        log.id.toString(),

        getStatusLabel(log.status),

        log.qr_code_id.toString(),

        log.resident?.full_name || "N/A",

        log.resident_id > 0 ? log.resident_id.toString() : "N/A",

        log.plate_number || "N/A",

        log.entry_time
          ? new Date(log.entry_time).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",

        log.exit_time
          ? new Date(log.exit_time).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Not exited",
      ]);

      // @ts-expect-error jspdf-autotable extension
      doc.autoTable({
        head: [
          [
            "ID",
            "Status",
            "QR ID",
            "Resident",
            "Resident ID",
            "Plate",
            "Entry Time",
            "Exit Time",
          ],
        ],

        body: tableData,

        startY: 35,

        styles: {
          fontSize: 7,
          cellPadding: 1.5,
        },

        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
        },

        margin: {
          top: 35,
          bottom: 10,
        },

        didDrawPage: (pageData: { pageNumber: number }) => {
          const pageCount = doc.internal.pages.length;

          doc.setFontSize(7);

          doc.setTextColor(150, 150, 150);

          doc.text(
            `Page ${pageData.pageNumber} of ${pageCount - 1}`,
            pageWidth - 20,
            doc.internal.pageSize.height - 5,
          );
        },
      });

      const fileName = `visitor-logs_${now.toISOString().split("T")[0]}.pdf`;

      doc.save(fileName);

      showExportSuccess();
    } catch (err) {
      console.error("Error exporting to PDF:", err);

      alert("Failed to export data to PDF");
    } finally {
      setExporting(false);

      setShowExportMenu(false);
    }
  };

  // ====================================================
  // EXPORT CSV
  // ====================================================

  const exportToCSV = () => {
    try {
      setExporting(true);

      const exportData = getExportData();

      if (exportData.length === 0) {
        alert("No data to export");

        setExporting(false);

        return;
      }

      const headers = [
        "ID",
        "Status",
        "QR Code ID",
        "Resident Name",

        "Plate Number",
        "Entry Time",
        "Exit Time",
        "Created At",
        "Image URL",
      ];

      const rows = exportData.map((log) => [
        log.id,

        getStatusLabel(log.status),

        log.qr_code_id,

        log.resident?.full_name || "N/A",

        log.resident_id > 0 ? log.resident_id : "N/A",

        log.plate_number || "N/A",

        log.entry_time
          ? new Date(log.entry_time).toLocaleString("en-US")
          : "N/A",

        log.exit_time
          ? new Date(log.exit_time).toLocaleString("en-US")
          : "Not exited",

        new Date(log.created_at).toLocaleString("en-US"),

        log.image_url || "No image",
      ]);

      const escapeCSV = (value: string | number) => {
        const stringValue = String(value);

        return `"${stringValue.replace(/"/g, '""')}"`;
      };

      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");

      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);

      const now = new Date();

      link.setAttribute(
        "download",
        `visitor-logs_${now.toISOString().split("T")[0]}.csv`,
      );

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showExportSuccess();
    } catch (err) {
      console.error("Error exporting to CSV:", err);

      alert("Failed to export data to CSV");
    } finally {
      setExporting(false);

      setShowExportMenu(false);
    }
  };

  // ====================================================
  // EFFECTS
  // ====================================================
  useEffect(() => {
    const initializeVisitorLogs = async () => {
      try {
        const saved = localStorage.getItem("visitorLogsFilters");

        if (saved) {
          const parsed = JSON.parse(saved);

          const { savedAt: _savedAt, ...filtersData } = parsed;

          setLocalFilters(filtersData);
          setFilters(filtersData);

          await fetchLogs(filtersData);
        } else {
          await fetchLogs({});
        }
      } catch (error) {
        console.error("Error initializing visitor logs:", error);

        await fetchLogs({});
      }
    };

    void initializeVisitorLogs();
  }, []);

  // ====================================================
  // HANDLERS
  // ====================================================

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleFilterChange = <K extends keyof LocalFilterParams>(
    key: K,
    value: LocalFilterParams[K],
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ====================================================
  // STATUS BADGE
  // ====================================================

  const getStatusBadge = (status: VisitorLogStatus) => {
    const statuses = {
      not_used: {
        icon: Clock,
        color: "text-muted-foreground bg-slate-500/10 border-slate-500/20",
        label: "Not Used",
      },

      active: {
        icon: CheckCircle,
        color: "text-green-400 bg-green-500/10 border-green-500/20",
        label: "Active",
      },

      completed: {
        icon: CheckCircle,
        color: "text-brand bg-blue-500/10 border-blue-500/20",
        label: "Completed",
      },

      expired: {
        icon: XCircle,
        color: "text-danger bg-danger-soft border-red-500/20",
        label: "Expired",
      },
    };

    const statusData = statuses[status];

    const Icon = statusData.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusData.color}`}
      >
        <Icon className="w-3 h-3" />

        {statusData.label}
      </span>
    );
  };

  // ====================================================
  // ACTIVE FILTERS
  // ====================================================

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== "" && value !== null,
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visitor Logs</h1>

          <p className="text-muted-foreground text-sm mt-1">
            Monitor all visitor entries and activities
          </p>
        </div>

        {/* EXPORT */}

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exporting || filteredData.length === 0}
              className={`${
                exportSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-ok hover:bg-emerald-600"
              } text-foreground`}
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </>
              )}

              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>

            {showExportMenu && !exporting && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={exportToExcel}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-ok" />

                  <span>Excel (.xlsx)</span>
                </button>

                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card transition-colors border-t border-border"
                >
                  <FileText className="w-4 h-4 text-danger" />

                  <span>PDF (.pdf)</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card transition-colors border-t border-border"
                >
                  <File className="w-4 h-4 text-brand" />

                  <span>CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <span className="text-muted-foreground font-medium">Filters</span>

            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-sky-500/20 text-brand rounded-full text-xs">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
              >
                Clear
              </button>
            )}

            <button
              onClick={saveFilters}
              disabled={savingFilters}
              className="flex items-center gap-1.5 text-sm text-brand hover:text-brand transition-colors px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20"
            >
              {savingFilters ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Apply
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* QR CODE ID */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-sm">QR Code ID</Label>

            <Input
              type="number"
              value={localFilters.qr_code_id || ""}
              onChange={(e) =>
                handleFilterChange(
                  "qr_code_id",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="QR Code ID..."
              className="bg-slate-800/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* RESIDENT NAME */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-sm">Resident Name</Label>

            <Input
              type="text"
              value={localFilters.resident_name || ""}
              onChange={(e) =>
                handleFilterChange("resident_name", e.target.value)
              }
              placeholder="Search resident name..."
              className="bg-slate-800/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* RESIDENT ID */}

          {/* FROM DATE */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-sm">From Date</Label>

            <Input
              type="datetime-local"
              value={localFilters.from_date || ""}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="bg-slate-800/50 border-border text-foreground"
            />
          </div>

          {/* TO DATE */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-sm">To Date</Label>

            <Input
              type="datetime-local"
              value={localFilters.to_date || ""}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="bg-slate-800/50 border-border text-foreground"
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bg-danger-soft border border-red-500/20 rounded-lg p-4 text-danger">
          {error}
        </div>
      )}

      {/* ==================================================
          TABLE
      ================================================== */}

      {!loading && !error && (
        <div className="border border-border rounded-2xl bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Status</TableHead>

                <TableHead className="text-muted-foreground">QR Code ID</TableHead>

                <TableHead className="text-muted-foreground">Resident</TableHead>

                <TableHead className="text-muted-foreground">Image</TableHead>

                <TableHead className="text-muted-foreground">Entry Time</TableHead>

                <TableHead className="text-muted-foreground">Exit Time</TableHead>

                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((log) => {
                const selected = selectedId === log.id;

                return (
                  <TableRow
                    key={log.id}
                    onClick={() => handleSelect(log.id)}
                    className={`cursor-pointer ${
                      selected ? "bg-sky-500/10" : ""
                    }`}
                  >
                    {/* STATUS */}

                    <TableCell>{getStatusBadge(log.status)}</TableCell>

                    {/* QR CODE */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-3.5 h-3.5 text-muted-foreground" />

                        <span className="text-foreground font-mono">
                          #{log.qr_code_id}
                        </span>
                      </div>
                    </TableCell>

                    {/* RESIDENT */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {log.resident?.full_name || "N/A"}
                          </span>

                          {log.resident_id > 0 && (
                            <span className="text-muted-foreground text-xs">
                              #{log.resident_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* IMAGE */}

                    <TableCell>
                      {log.image_url ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setImageModal({
                              open: true,
                              url: log.image_url,
                            });
                          }}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-card hover:opacity-80 transition-opacity border border-border"
                        >
                          <img
                            src={log.image_url}
                            alt="Visitor"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center border border-border">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>

                    {/* ENTRY TIME */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          {formatDate(log.entry_time)}
                        </span>
                      </div>
                    </TableCell>

                    {/* EXIT TIME */}

                    <TableCell>
                      {log.exit_time ? (
                        <div className="flex items-center gap-2">
                          <DoorClosed className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                          <span className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDate(log.exit_time)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Not exited
                        </span>
                      )}
                    </TableCell>

                    {/* ACTION */}

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/dashboard/visitor-logs/${log.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded hover:bg-slate-800/50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-brand" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* EMPTY */}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <DoorOpen className="w-12 h-12 text-foreground" />

                      <p className="text-sm">No visitor logs found</p>

                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ==================================================
          IMAGE MODAL
      ================================================== */}

      {imageModal.open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() =>
            setImageModal({
              open: false,
              url: "",
            })
          }
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageModal.url}
              alt="Visitor"
              className="w-full h-full object-contain max-h-[80vh]"
            />

            <button
              onClick={() =>
                setImageModal({
                  open: false,
                  url: "",
                })
              }
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
