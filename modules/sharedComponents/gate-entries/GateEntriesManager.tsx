"use client";

import { useEffect, useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import {
  Eye,
  Car,
  User,
  DoorOpen,
  Calendar,
  Image as ImageIcon,
  Hash,
  Loader2,
  Filter,
  X,
  Download,
  Check,
  Save,
  FileSpreadsheet,
  FileText,
  File,
  ChevronDown,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ==================== Types ====================

type Resident = {
  id: number;
  full_name: string;
};

type GateEntry = {
  id: number;

  // Backend بيرجع lowercase
  entry_type: "entry" | "exit" | "ENTRY" | "EXIT";

  entry_by: "resident" | "plate" | "manual" | "qr" | "QR" | "PLATE" | "MANUAL";

  entry_by_table_id: number | null;

  image_url: string | null;

  plate_number: string | null;

  resident_id: number | null;

  gate_id: number;

  created_at: string;

  resident: Resident | null;
};

type FilterParams = {
  entry_type?: "entry" | "exit" | "ENTRY" | "EXIT";
  entry_by?: "resident" | "plate" | "manual" | "qr" | "QR" | "PLATE" | "MANUAL";
  plate_number?: string;
  resident_id?: number;
  gate_id?: number;
  from_date?: string;
  to_date?: string;
};

type ExportFormat = "excel" | "pdf" | "csv";

// ==================== Main Component ====================

export default function GateEntriesManager() {
  // ====================
  // State
  // ====================

  const [data, setData] = useState<GateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterParams>({});

  const [localFilters, setLocalFilters] = useState<FilterParams>({});

  // فلتر اسم الريزدنت - Frontend filter
  const [residentName, setResidentName] = useState("");

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

  // ====================
  // API
  // ====================

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const API = `${API_BASE}`;

  const fetchEntries = async (filterParams?: FilterParams) => {
    try {
      setLoading(true);

      const params = filterParams || filters;

      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== undefined && value !== "" && value !== null,
        ),
      );

      const response = await api.get(`${API}/gate-entries/`, {
        params: cleanedParams,
      });

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setData(responseData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch gate entries:", err);
      setError("Failed to fetch gate entries");
    } finally {
      setLoading(false);
    }
  };

  // ====================
  // Resident Name Filter
  // ====================

  const filteredData = useMemo(() => {
    const search = residentName.trim().toLowerCase();

    if (!search) {
      return data;
    }

    return data.filter((entry) =>
      entry.resident?.full_name?.toLowerCase().includes(search),
    );
  }, [data, residentName]);

  // ====================
  // Filters
  // ====================

  const applyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    fetchEntries(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: FilterParams = {};

    setFilters(emptyFilters);
    setLocalFilters(emptyFilters);
    setResidentName("");

    fetchEntries(emptyFilters);
  };

  // ====================
  // Save Filters
  // ====================

  const saveFilters = () => {
    try {
      setSavingFilters(true);

      const filtersToSave = {
        ...localFilters,
        residentName,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("gateEntriesFilters", JSON.stringify(filtersToSave));

      applyFilters(localFilters);

      setTimeout(() => {
        setSavingFilters(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving filters:", error);
      setSavingFilters(false);
    }
  };

  // ====================
  // Load Saved Filters
  // ====================

  const loadSavedFilters = () => {
    try {
      const saved = localStorage.getItem("gateEntriesFilters");

      if (saved) {
        const parsed = JSON.parse(saved);

        const {
          savedAt,
          residentName: savedResidentName,
          ...filtersData
        } = parsed;

        setLocalFilters(filtersData);
        setResidentName(savedResidentName || "");

        applyFilters(filtersData);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  };

  // ====================
  // Export
  // ====================

  const getExportData = (): GateEntry[] => {
    return filteredData;
  };

  const exportToExcel = () => {
    try {
      setExporting(true);

      const exportData = getExportData();

      if (exportData.length === 0) {
        alert("No data to export");
        setExporting(false);
        return;
      }

      const excelData = exportData.map((entry) => ({
        ID: entry.id,

        "Gate Type":
          entry.entry_type.toLowerCase() === "entry" ? "Entry" : "Exit",

        Method:
          entry.entry_by.toLowerCase() === "qr"
            ? "QR Code"
            : entry.entry_by.toLowerCase() === "plate"
              ? "Plate Number"
              : entry.entry_by.toLowerCase() === "resident"
                ? "Resident"
                : "Manual",

        "Plate Number": entry.plate_number || "N/A",

        "Resident Name": entry.resident?.full_name || "N/A",

        "Resident ID": entry.resident_id ?? "N/A",

        "Gate ID": entry.gate_id > 0 ? entry.gate_id : "N/A",

        "Date & Time": new Date(entry.created_at).toLocaleString("en-US"),

        "Image URL": entry.image_url || "No image",
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);

      ws["!cols"] = [
        { wch: 8 },
        { wch: 12 },
        { wch: 16 },
        { wch: 18 },
        { wch: 25 },
        { wch: 14 },
        { wch: 12 },
        { wch: 25 },
        { wch: 40 },
      ];

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Gate Entries");

      const now = new Date();

      XLSX.writeFile(
        wb,
        `gate-entries_${now.toISOString().split("T")[0]}.xlsx`,
      );

      showExportSuccess();
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Failed to export data to Excel");
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

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
        "Gate Type",
        "Method",
        "Plate Number",
        "Resident Name",
        "Resident ID",
        "Gate ID",
        "Date & Time",
        "Image URL",
      ];

      const rows = exportData.map((entry) => [
        entry.id,

        entry.entry_type,

        entry.entry_by,

        entry.plate_number || "N/A",

        entry.resident?.full_name || "N/A",

        entry.resident_id ?? "N/A",

        entry.gate_id,

        new Date(entry.created_at).toLocaleString("en-US"),

        entry.image_url || "No image",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");

      const url = URL.createObjectURL(blob);

      link.href = url;

      const now = new Date();

      link.download = `gate-entries_${now.toISOString().split("T")[0]}.csv`;

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

      doc.text("Gate Entries Report", pageWidth / 2, 15, { align: "center" });

      const tableData = exportData.map((entry) => [
        entry.id.toString(),

        entry.entry_type,

        entry.entry_by,

        entry.plate_number || "N/A",

        entry.resident?.full_name || "N/A",

        entry.resident_id?.toString() || "N/A",

        entry.gate_id.toString(),

        new Date(entry.created_at).toLocaleString("en-US"),
      ]);

      // @ts-expect-error jspdf-autotable plugin
      doc.autoTable({
        head: [
          [
            "ID",
            "Type",
            "Method",
            "Plate",
            "Resident",
            "Resident ID",
            "Gate ID",
            "Date & Time",
          ],
        ],

        body: tableData,

        startY: 25,

        styles: {
          fontSize: 7,
          cellPadding: 1.5,
        },
      });

      const now = new Date();

      doc.save(`gate-entries_${now.toISOString().split("T")[0]}.pdf`);

      showExportSuccess();
    } catch (err) {
      console.error("Error exporting to PDF:", err);
      alert("Failed to export data to PDF");
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

  const showExportSuccess = () => {
    setExportSuccess(true);

    setTimeout(() => {
      setExportSuccess(false);
    }, 3000);
  };

  // ====================
  // Effects
  // ====================

  useEffect(() => {
    const initializeGateEntries = async () => {
      try {
        const saved = localStorage.getItem("gateEntriesFilters");

        if (saved) {
          const parsed = JSON.parse(saved);

          const { savedAt: _savedAt, ...filtersData } = parsed;

          setLocalFilters(filtersData);
          setFilters(filtersData);

          await fetchEntries(filtersData);
        } else {
          await fetchEntries({});
        }
      } catch (error) {
        console.error("Error initializing gate entries:", error);

        await fetchEntries({});
      }
    };

    void initializeGateEntries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================
  // Handlers
  // ====================

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleFilterChange = (
    key: keyof FilterParams,
    value: string | number | undefined,
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value,
    }));
  };

  // ====================
  // Helpers
  // ====================

  const formatDate = (dateString: string) => {
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

  const getEntryTypeBadge = (type: GateEntry["entry_type"]) => {
    const isEntry = type.toLowerCase() === "entry";

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
          isEntry
            ? "text-ok bg-emerald-500/10 border-emerald-500/20"
            : "text-danger bg-danger-soft border-red-500/20"
        }`}
      >
        {isEntry ? (
          <DoorOpen className="w-3 h-3" />
        ) : (
          <DoorOpen className="w-3 h-3" />
        )}

        {isEntry ? "Entry" : "Exit"}
      </span>
    );
  };

  const getEntryByBadge = (method: GateEntry["entry_by"]) => {
    const normalized = method.toLowerCase();

    if (normalized === "plate") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border text-purple-400 bg-purple-500/10 border-purple-500/20">
          <Car className="w-3 h-3" />
          Plate
        </span>
      );
    }

    if (normalized === "qr") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border text-brand bg-blue-500/10 border-blue-500/20">
          <QrCode className="w-3 h-3" />
          QR Code
        </span>
      );
    }

    if (normalized === "resident") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border text-green-400 bg-green-500/10 border-green-500/20">
          <User className="w-3 h-3" />
          Resident
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border text-orange-400 bg-orange-500/10 border-orange-500/20">
        <User className="w-3 h-3" />
        Manual
      </span>
    );
  };

  const hasActiveFilters =
    Object.values(localFilters).some(
      (value) => value !== undefined && value !== "" && value !== null,
    ) || residentName.trim() !== "";

  // ====================
  // Render
  // ====================

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        {/* Export */}

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
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card"
                >
                  <FileSpreadsheet className="w-4 h-4 text-ok" />
                  Excel (.xlsx)
                </button>

                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card border-t border-border"
                >
                  <FileText className="w-4 h-4 text-danger" />
                  PDF (.pdf)
                </button>

                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-card border-t border-border"
                >
                  <File className="w-4 h-4 text-brand" />
                  CSV (.csv)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}

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

          <button
            onClick={saveFilters}
            disabled={savingFilters}
            className="flex items-center gap-1.5 text-brand hover:text-brand px-3 py-1.5 rounded-lg bg-sky-500/10"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gate Type */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Gate Type</Label>

            <Select
              value={localFilters.entry_type || "all"}
              onValueChange={(value) => handleFilterChange("entry_type", value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-border text-foreground">
                <SelectValue placeholder="All types" />
              </SelectTrigger>

              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="all">All</SelectItem>

                <SelectItem value="entry">Entry</SelectItem>

                <SelectItem value="exit">Exit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entry Method */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Passing Method</Label>

            <Select
              value={localFilters.entry_by || "all"}
              onValueChange={(value) => handleFilterChange("entry_by", value)}
            >
              <SelectTrigger className="bg-slate-800/50 border-border text-foreground">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>

              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="all">All</SelectItem>

                <SelectItem value="resident">LPR</SelectItem>
                <SelectItem value="qr">QR Code</SelectItem>

                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plate Number */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Plate Number</Label>

            <Input
              value={localFilters.plate_number || ""}
              onChange={(e) =>
                handleFilterChange("plate_number", e.target.value)
              }
              placeholder="Search plate..."
              className="bg-slate-800/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Resident Name */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Resident Name</Label>

            <Input
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              placeholder="Search resident name..."
              className="bg-slate-800/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Gate ID */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Gate ID</Label>

            <Input
              type="number"
              value={localFilters.gate_id ?? ""}
              onChange={(e) =>
                handleFilterChange(
                  "gate_id",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="Gate ID..."
              className="bg-slate-800/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* From Date */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">From Date</Label>

            <Input
              type="datetime-local"
              value={localFilters.from_date || ""}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="bg-slate-800/50 border-border text-foreground"
            />
          </div>

          {/* To Date */}

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">To Date</Label>

            <Input
              type="datetime-local"
              value={localFilters.to_date || ""}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="bg-slate-800/50 border-border text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="bg-danger-soft border border-red-500/20 rounded-lg p-4 text-danger">
          {error}
        </div>
      )}

      {/* Table */}

      {!loading && !error && (
        <div className="border border-border rounded-2xl bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Type</TableHead>

                <TableHead className="text-muted-foreground">Method</TableHead>

                <TableHead className="text-muted-foreground">
                  Plate Number
                </TableHead>

                <TableHead className="text-muted-foreground">
                  Resident
                </TableHead>

                <TableHead className="text-muted-foreground">Gate ID</TableHead>

                <TableHead className="text-muted-foreground">Image</TableHead>

                <TableHead className="text-muted-foreground">
                  Date & Time
                </TableHead>

                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((entry) => {
                const selected = selectedId === entry.id;

                return (
                  <TableRow
                    key={entry.id}
                    onClick={() => handleSelect(entry.id)}
                    className={`cursor-pointer ${
                      selected ? "bg-sky-500/10" : ""
                    }`}
                  >
                    {/* Type */}

                    <TableCell>{getEntryTypeBadge(entry.entry_type)}</TableCell>

                    {/* Method */}

                    <TableCell>{getEntryByBadge(entry.entry_by)}</TableCell>

                    {/* Plate */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-muted-foreground" />

                        <span className="text-foreground font-medium font-mono">
                          {entry.plate_number || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Resident Name */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />

                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {entry.resident?.full_name || "N/A"}
                          </span>

                          {entry.resident_id && (
                            <span className="text-xs text-muted-foreground">
                              #{entry.resident_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Gate */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-muted-foreground" />

                        <span className="text-muted-foreground">
                          {entry.gate_id > 0 ? `#${entry.gate_id}` : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Image */}

                    <TableCell>
                      {entry.image_url ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setImageModal({
                              open: true,
                              url: entry.image_url!,
                            });
                          }}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-card hover:opacity-80 transition-opacity border border-border"
                        >
                          <img
                            src={entry.image_url}
                            alt="Entry"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center border border-border">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>

                    {/* Date */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />

                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Action */}

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/dashboard/gate-entries/${entry.id}`}
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

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-12"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <DoorOpen className="w-12 h-12 text-foreground" />

                      <p className="text-sm">No gate entries found</p>

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

      {/* Image Modal */}

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
              alt="Entry"
              className="w-full h-full object-contain max-h-[80vh]"
            />

            <button
              onClick={() =>
                setImageModal({
                  open: false,
                  url: "",
                })
              }
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
