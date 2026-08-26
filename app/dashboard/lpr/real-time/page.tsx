"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getPlates } from "@/services/plate";
import { getGateEntry, getGates } from "@/services/gate";
import { openGate, closeGate } from "@/services/access-control";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GateData, GateEntry } from "@/modules/types/gateEntry";

import {
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineOfficeBuilding,
  HiOutlineMap,
} from "react-icons/hi";
import Gate from "@/modules/sharedComponents/gate-entries/Gate";

// ✅ استيراد PillTabs بدل LPRTabs
import { PillTabs } from "@/shared/ui/voom";

// ✅ تعريف التابس
const LPR_TABS = [
  { label: "Real Time Gates", href: "/dashboard/lpr/real-time" },
  { label: "Gates", href: "/dashboard/lpr/gates" },
  { label: "Cameras", href: "/dashboard/lpr/cameras" },
  { label: "Plates", href: "/dashboard/lpr/plates" },
];

type Plate = {
  id: number;
  plate_number_full: string;
};

type Gate = {
  id: number;
  name: string;
  desc: string;
  x?: number;
  y?: number;
  isOpen?: boolean;
  queueCount?: number;
  entryCount?: number;
};

type CongestionLevel = "light" | "medium" | "heavy";

type ThresholdSettings = {
  light: number;
  heavy: number;
  colors: {
    light: string;
    medium: string;
    heavy: string;
  };
};

const DEFAULT_SETTINGS: ThresholdSettings = {
  light: 2,
  heavy: 5,
  colors: {
    light: "#10b981",
    medium: "#f59e0b",
    heavy: "#f43f5e",
  },
};

type LogEntry = {
  message: string;
  queueCount: number;
  timeDate: string;
  gateName: string;
  level: CongestionLevel;
  isOpen: boolean;
};

type GatePosition = {
  x: number;
  y: number;
};

export default function LiveDemoPage() {
  const pathname = usePathname();
  const [plates, setPlates] = useState<Plate[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gateLoading, setGateLoading] = useState(false);
  const gateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<GateEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<GateEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // =========================
  // SETTINGS STATE
  // =========================
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [draftSettings, setDraftSettings] = useState(DEFAULT_SETTINGS);

  // =========================
  // MAP STATE
  // =========================
  const [mapOpen, setMapOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // DRAG & DROP STATE
  // =========================
  const [draggedGate, setDraggedGate] = useState<Gate | null>(null);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Pointer drag state
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const [activeDragGateId, setActiveDragGateId] = useState<string | null>(null);
  const [gatePositions, setGatePositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const saved = localStorage.getItem("gatePositions");

      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Error loading gate positions:", error);

      return {};
    }
  });
  const [mapImage, setMapImage] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return localStorage.getItem("mapImage");
    } catch (error) {
      console.error("Error loading map image:", error);

      return null;
    }
  });

  const [trafficSettings, setTrafficSettings] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    try {
      const saved = localStorage.getItem("trafficSettings");

      if (!saved) {
        return DEFAULT_SETTINGS;
      }

      const parsed = JSON.parse(saved);

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        colors: {
          ...DEFAULT_SETTINGS.colors,
          ...parsed.colors,
        },
      };
    } catch (error) {
      console.error("Error loading traffic settings:", error);

      return DEFAULT_SETTINGS;
    }
  });

  const openMap = () => {
    setMapOpen(true);
    setUploadError(null);
  };

  const openSettings = () => {
    setDraftSettings(trafficSettings);
    setSettingsOpen(true);
  };

  const saveSettings = () => {
    if (draftSettings.light < 0) {
      alert("Light value cannot be negative");
      return;
    }

    if (draftSettings.heavy <= draftSettings.light) {
      alert("Heavy value must be greater than Light");
      return;
    }

    setTrafficSettings(draftSettings);
    localStorage.setItem("trafficSettings", JSON.stringify(draftSettings));
    setSettingsOpen(false);
  };

  const mediumThreshold = Math.floor(
    (draftSettings.light + draftSettings.heavy) / 2,
  );

  // =========================
  // IMAGE HANDLING - FRONTEND ONLY
  // =========================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imageData = event.target?.result as string;
        setMapImage(imageData);
        localStorage.setItem("mapImage", imageData);
        setUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error reading file:", error);
        setUploadError("Failed to read image file");
        setUploadingImage(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read image file");
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setMapImage(null);
    localStorage.removeItem("mapImage");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
  };

  // =========================
  // DRAG & DROP HANDLERS (HTML5 Drag)
  // =========================
  const handleDragStart = (e: React.DragEvent, gate: Gate) => {
    setDraggedGate(gate);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", gate.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDragPosition({
        x: Math.min(95, Math.max(5, x)),
        y: Math.min(95, Math.max(5, y)),
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (mapRef.current && draggedGate) {
      const rect = mapRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;

      x = Math.min(95, Math.max(5, x));
      y = Math.min(95, Math.max(5, y));

      // Save position
      setGatePositions((prev) => {
        const updated = {
          ...prev,
          [draggedGate.id]: { x, y },
        };
        localStorage.setItem("gatePositions", JSON.stringify(updated));
        return updated;
      });

      setGates((prevGates) =>
        prevGates.map((gate) =>
          gate.id === draggedGate.id ? { ...gate, x, y } : gate,
        ),
      );

      if (selectedGate?.id === draggedGate.id) {
        setSelectedGate((prev) => (prev ? { ...prev, x, y } : null));
      }

      setLogs((prev) => [
        {
          message: `Gate ${draggedGate.name} repositioned on map`,
          queueCount: draggedGate.queueCount || 0,
          timeDate: formatTimeDate(),
          gateName: draggedGate.name,
          level: getCongestionLevel(draggedGate.queueCount || 0),
          isOpen: draggedGate.isOpen || false,
        },
        ...prev,
      ]);
    }

    setDraggedGate(null);
    setDragPosition(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedGate(null);
    setDragPosition(null);
  };

  // =========================
  // POINTER DRAG HANDLERS (for touch/click drag)
  // =========================
  const handleGatePointerDown = (e: React.PointerEvent, gateId: string) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    setIsPointerDragging(true);
    setActiveDragGateId(gateId);
  };

  const handleGatePointerMove = (e: React.PointerEvent, gateId: string) => {
    if (!isPointerDragging || activeDragGateId !== gateId) return;

    const mapElement = mapRef.current;
    if (!mapElement) return;

    const rect = mapElement.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.min(95, Math.max(5, x));
    y = Math.min(95, Math.max(5, y));

    // Update position in real-time
    setGatePositions((prev) => {
      const updated = {
        ...prev,
        [gateId]: { x, y },
      };
      localStorage.setItem("gatePositions", JSON.stringify(updated));
      return updated;
    });

    setGates((prevGates) =>
      prevGates.map((gate) =>
        gate.id === Number(gateId) ? { ...gate, x, y } : gate,
      ),
    );
  };

  const handlePointerUp = useCallback(() => {
    setIsPointerDragging(false);
    setActiveDragGateId(null);
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  // =========================
  // CONGESTION LEVEL BASED ON ENTRY COUNT
  // =========================
  const getCongestionLevelByEntryCount = useCallback(
    (entryCount: number): CongestionLevel => {
      const { light, heavy } = trafficSettings;
      const medium = Math.floor((light + heavy) / 2);

      if (entryCount >= heavy) return "heavy";
      if (entryCount >= medium) return "medium";
      return "light";
    },
    [trafficSettings],
  );

  // =========================
  // CONGESTION LEVEL HELPER
  // =========================
  const getCongestionLevel = useCallback(
    (queueCount: number): CongestionLevel => {
      const { light, heavy } = trafficSettings;
      const medium = Math.floor((light + heavy) / 2);

      if (queueCount >= heavy) {
        return "heavy";
      }
      if (queueCount >= medium) {
        return "medium";
      }
      return "light";
    },
    [trafficSettings],
  );

  // =========================
  // FETCH ALL GATE ENTRIES
  // =========================
  const fetchAllGateEntries = useCallback(async () => {
    try {
      setLoadingEntries(true);
      const data = await getGateEntry();
      console.log("All gate entries received:", data);

      const entriesArray = Array.isArray(data) ? data : [];
      setEntries(entriesArray);

      // Update gate entry counts
      const entryCountMap = new Map<number, number>();
      entriesArray.forEach((entry) => {
        if (entry.gate_id != null) {
          entryCountMap.set(
            entry.gate_id,
            (entryCountMap.get(entry.gate_id) ?? 0) + 1,
          );
        }
      });

      setGates((prevGates) =>
        prevGates.map((gate) => ({
          ...gate,
          entryCount: entryCountMap.get(gate.id) ?? 0,
        })),
      );

      return entriesArray;
    } catch (error) {
      console.error("Error fetching gate entries:", error);
      setEntries([]);
      return [];
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  // =========================
  // FILTER ENTRIES BY GATE ID
  // =========================
  const filterEntriesByGate = useCallback(
    (gateId: number, allEntries: GateEntry[]) => {
      const filtered = allEntries.filter((entry) => entry.gate_id === gateId);
      setFilteredEntries(filtered);
    },
    [],
  );

  // =========================
  // HANDLE GATE SELECTION
  // =========================
  const handleGateSelect = useCallback(
    (gate: Gate) => {
      setSelectedGate(gate);
      if (gate.id && entries.length > 0) {
        filterEntriesByGate(gate.id, entries);
      }
    },
    [entries, filterEntriesByGate],
  );

  // =========================
  // FORMAT TIME DATE
  // =========================
  const formatTimeDate = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // =========================
  // GET GATE NAME BY ID
  // =========================
  const getGateName = (gateId: number) => {
    const gate = gates.find((g) => g.id === gateId);
    return gate?.name || `Gate ${gateId}`;
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    let isMounted = true;
    let isDataLoaded = false;

    const load = async () => {
      if (isDataLoaded) return;
      isDataLoaded = true;

      try {
        setIsLoading(true);
        console.log("Starting initial data load...");

        const gateData = await getGates();
        console.log("Gates received:", gateData);

        if (isMounted) {
          const gatesArray = Array.isArray(gateData)
            ? gateData
            : gateData?.data || gateData?.gates || [];

          const positions = [
            { x: 20, y: 30 },
            { x: 70, y: 25 },
            { x: 40, y: 60 },
            { x: 80, y: 75 },
            { x: 15, y: 80 },
            { x: 55, y: 40 },
          ];

          const mapped = gatesArray.map((gate: GateData, index: number) => ({
            ...gate,
            x: positions[index % positions.length].x,
            y: positions[index % positions.length].y,
            isOpen: false,
            queueCount: Math.floor(Math.random() * 15) + 1,
            entryCount: 0,
          }));

          // Apply saved positions
          const mappedWithPositions = mapped.map((gate: Gate) => {
            const savedPos = gatePositions[gate.id];
            if (savedPos) {
              return { ...gate, x: savedPos.x, y: savedPos.y };
            }
            return gate;
          });

          setGates(mappedWithPositions);

          const allEntries = await fetchAllGateEntries();

          if (mappedWithPositions.length > 0) {
            setSelectedGate(mappedWithPositions[0]);
            if (mappedWithPositions[0].id && allEntries.length > 0) {
              filterEntriesByGate(mappedWithPositions[0].id, allEntries);
            }
          }

          const plateData = await getPlates();
          console.log("Plates received:", plateData);
          setPlates(plateData);
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update gate status
  const updateGateStatus = (gateId: number, isOpen: boolean) => {
    setGates((prev) =>
      prev.map((gate) => (gate.id === gateId ? { ...gate, isOpen } : gate)),
    );
  };

  // =========================
  // ENTRY TYPE COLOR HELPER
  // =========================
  const getEntryTypeColor = (type: string | undefined | null) => {
    if (!type) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    const normalizedType = type.toLowerCase();
    if (normalizedType === "entry" || normalizedType === "in")
      return "bg-ok/15 text-ok border-emerald-500/30";
    if (normalizedType === "exit" || normalizedType === "out")
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    return "bg-blue-500/20 text-brand border-blue-500/30";
  };

  // =========================
  // GET LEVEL COLOR BASED ON ENTRY COUNT
  // =========================
  const getLevelColorByEntryCount = (entryCount: number = 0) => {
    const { light, heavy } = trafficSettings;
    const medium = Math.floor((light + heavy) / 2);

    if (entryCount >= heavy) return "bg-danger";
    if (entryCount >= medium) return "bg-warn";
    return "bg-ok";
  };

  const getLevelTextColor = (level: CongestionLevel) => {
    if (level === "heavy") return "text-rose-400";
    if (level === "medium") return "text-warn";
    return "text-ok";
  };

  const getLevelBgColor = (level: CongestionLevel) => {
    if (level === "heavy") return "bg-rose-500/20 border-rose-500/30";
    if (level === "medium") return "bg-warn/15 border-amber-500/30";
    return "bg-ok/15 border-emerald-500/30";
  };

  const getLevelLabel = (level: CongestionLevel) => {
    if (level === "heavy") return "HEAVY";
    if (level === "medium") return "MEDIUM";
    return "LIGHT";
  };

  const getOpenTextColor = (isOpen?: boolean) =>
    isOpen ? "text-ok" : "text-muted-foreground";

  const getOpenBgColor = (isOpen?: boolean) =>
    isOpen
      ? "bg-ok/15 border-emerald-500/30"
      : "bg-slate-500/20 border-slate-500/30";

  const getOpenLabel = (isOpen?: boolean) => (isOpen ? "OPEN" : "CLOSED");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ TABS - باستخدام PillTabs زي صفحة Gates بالضبط */}
      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/real-time" />

      {/* MAIN CONTENT */}
      <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <div className="flex items-center gap-6">
            <button
              onClick={openMap}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg flex items-center gap-2"
              aria-label="map"
            >
              <Image
                src="/map.png"
                alt="map"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-lg font-[700] text-muted-foreground hover:text-foreground transition-colors">
                Map
              </span>
            </button>

            <button
              onClick={openSettings}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg flex items-center gap-2"
              aria-label="Settings"
            >
              <HiOutlineCog className="w-5 h-5" />
              <span className="text-lg font-[700] text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </span>
            </button>
          </div>
        </div>

        {/* GATES TABLE - DRAGGABLE */}
        <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-[#F2F6FB] dark:bg-slate-800/40 text-[#7C93B4]">
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Gate Name
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Description
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Status
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Entries
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Traffic
                  </th>
                </tr>
              </thead>
              <tbody>
                {gates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-lg text-muted-foreground"
                    >
                      No gates available
                    </td>
                  </tr>
                ) : (
                  gates.map((gate) => {
                    const entryCount = gate.entryCount || 0;
                    const level = getCongestionLevelByEntryCount(entryCount);
                    const isOpen = gate.isOpen || false;
                    const isSelected = selectedGate?.id === gate.id;

                    return (
                      <tr
                        key={gate.id}
                        onClick={() => handleGateSelect(gate)}
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-[18px] font-[600] text-foreground dark:text-white">
                                {gate.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[18px] font-[500] text-[#3B5473] dark:text-white">
                            {gate.desc || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`
                            text-[18px] font-[600]
                            ${
                              isOpen
                                ? "text-[#10b981]"
                                : "text-[#3B5473] dark:text-white"
                            }
                          `}
                          >
                            {isOpen ? "OPEN" : "CLOSED"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[18px] font-[500] text-[#3B5473] dark:text-white">
                            {entryCount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`
                            text-[18px] font-[600]
                            ${
                              level === "heavy"
                                ? "text-rose-400"
                                : level === "medium"
                                  ? "text-warn"
                                  : "text-ok"
                            }
                          `}
                          >
                            {level.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MAIN GRID - NEW LAYOUT: Heat Map on Left (2/3), Gate on Right (1/3) */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT - Heat Map (takes 8 columns = 2/3) */}
          <div className="col-span-8">
            <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-bold">Gate Heat Map</h2>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: trafficSettings.colors.light }}
                    ></span>
                    <span className="text-muted-foreground text-lg">
                      Light (0-{mediumThreshold - 1})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: trafficSettings.colors.heavy }}
                    ></span>
                    <span className="text-muted-foreground text-lg">
                      Heavy ({trafficSettings.heavy}+)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: trafficSettings.colors.medium }}
                    ></span>
                    <span className="text-muted-foreground text-lg">
                      Medium ({mediumThreshold}-{trafficSettings.heavy - 1})
                    </span>
                  </div>
                </div>
              </div>

              <div
                ref={mapRef}
                className="relative h-[600px] rounded-xl overflow-hidden border border-border"
                style={
                  mapImage
                    ? {
                        backgroundImage: `url(${mapImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!mapImage && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
                )}
                {mapImage && (
                  <div className="absolute inset-0 bg-slate-900/30" />
                )}
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full grid grid-cols-10 grid-rows-6">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div key={i} className="border border-border" />
                    ))}
                  </div>
                </div>
                {/* Drop zone indicator */}
                {isDragging && dragPosition && (
                  <div
                    className="absolute pointer-events-none z-50"
                    style={{
                      left: `${dragPosition.x}%`,
                      top: `${dragPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand bg-blue-400/20 animate-pulse flex items-center justify-center">
                      <span className="text-brand text-xs font-bold">DROP</span>
                    </div>
                  </div>
                )}

                {/* Gates on map - Draggable */}
                {gates.map((gate) => {
                  const position = gatePositions[gate.id];
                  const x = position?.x ?? gate.x ?? 50;
                  const y = position?.y ?? gate.y ?? 50;
                  const entryCount = gate.entryCount || 0;
                  const level = getCongestionLevelByEntryCount(entryCount);
                  const isOpen = gate.isOpen || false;
                  const isBeingDragged =
                    draggedGate?.id === gate.id && isDragging;

                  return (
                    <div
                      key={gate.id}
                      onPointerDown={(e) =>
                        handleGatePointerDown(e, String(gate.id))
                      }
                      onPointerMove={(e) =>
                        handleGatePointerMove(e, String(gate.id))
                      }
                      onClick={() => handleGateSelect(gate)}
                      className="absolute cursor-grab active:cursor-grabbing touch-none select-none group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                        zIndex: selectedGate?.id === gate.id ? 30 : 20,
                        opacity: isBeingDragged ? 0.5 : 1,
                      }}
                    >
                      <div
                        className={`
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  transition-transform
                  duration-150
                  ${selectedGate?.id === gate.id ? "scale-110" : "hover:scale-105"}
                `}
                      >
                        {/* GATE */}
                        <Gate open={isOpen} size="sm" />

                        {/* Gate Name */}
                        <span className="text-[8px] text-muted-foreground mt-1 font-[700] whitespace-nowrap">
                          {gate.name.length > 8
                            ? gate.name.substring(0, 8) + ".."
                            : gate.name}
                        </span>

                        {/* Congestion Badge */}
                        <div
                          className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border border-border flex items-center justify-center text-[8px] font-bold text-foreground ${
                            level === "heavy"
                              ? "bg-danger"
                              : level === "medium"
                                ? "bg-warn"
                                : "bg-ok"
                          }`}
                        >
                          {entryCount}
                        </div>

                        {/* Selected Border */}
                        {selectedGate?.id === gate.id && (
                          <div className="absolute -inset-2 rounded-xl border-2 border-brand pointer-events-none" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg border border-border px-2 py-1 shadow-xl">
                            <span className="text-foreground text-[10px] font-bold">
                              {gate.name}
                            </span>
                            <span
                              className={`text-[10px] ml-1 ${getLevelTextColor(level)}`}
                            >
                              ({entryCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!isDragging && gates.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2">↕</div>
                      <p className="text-lg">Drag gates from table to map</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Gate Section (takes 4 columns = 1/3) */}
          <div className="col-span-4">
            {/* Selected Gate - Full height to match map */}
            <div className="backdrop-blur-sm border border-border rounded-2xl p-6 bg-[#0B1B30] h-full flex flex-col">
              {/* Header with Gate Info */}
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-[18px] font-[700] uppercase tracking-wider">
                      Selected Gate
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {selectedGate?.name || "No Gate"}
                    </h2>
                    <p className="text-muted-foreground text-[18px] mt-0.5">
                      {selectedGate?.desc || "Select a gate from the map"}
                    </p>
                  </div>

                  {selectedGate && (
                    <div className="text-right">
                      <p className="text-[18px]">
                        <span className="text-muted-foreground">Traffic:</span>{" "}
                        <span
                          className={`font-semibold ${getLevelTextColor(
                            getCongestionLevelByEntryCount(
                              selectedGate.entryCount || 0,
                            ),
                          )}`}
                        >
                          {getLevelLabel(
                            getCongestionLevelByEntryCount(
                              selectedGate.entryCount || 0,
                            ),
                          )}
                        </span>
                      </p>
                      <p className="text-[18px] text-muted-foreground">
                        Entries: {selectedGate.entryCount || 0}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Large Gate Animation - flex-1 to fill remaining space */}
              <div className="bg-slate-800/30 rounded-xl p-3 flex flex-col items-center justify-center border border-border flex-1 min-h-[200px]">
                <div className="transform scale-125">
                  <Gate open={gateOpen} size="md" />
                </div>

                <div className="mt-4 text-center">
                  {status === "idle" && (
                    <p className="text-muted-foreground text-[18px] flex items-center gap-2">
                      <HiOutlineClock className="w-4 h-4" />
                      Waiting for plate...
                    </p>
                  )}

                  {status === "granted" && (
                    <div className="flex items-center gap-3">
                      <HiOutlineCheckCircle className="w-6 h-6 text-ok" />
                      <h2 className="text-xl font-bold text-ok">GRANTED</h2>
                    </div>
                  )}

                  {status === "denied" && (
                    <div className="flex items-center gap-3">
                      <HiOutlineXCircle className="w-6 h-6 text-rose-400" />
                      <h2 className="text-xl font-bold text-rose-400">
                        DENIED
                      </h2>
                    </div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  disabled={!selectedGate || gateLoading}
                  onClick={async () => {
                    if (!selectedGate) return;
                    try {
                      setGateLoading(true);
                      await openGate(selectedGate.id);
                      setGateOpen(true);
                      updateGateStatus(selectedGate.id, true);
                      setLogs((prev) => [
                        {
                          message: `Gate ${selectedGate.name} opened manually`,
                          queueCount: selectedGate.queueCount || 0,
                          timeDate: formatTimeDate(),
                          gateName: selectedGate.name,
                          level: getCongestionLevel(
                            selectedGate.queueCount || 0,
                          ),
                          isOpen: true,
                        },
                        ...prev,
                      ]);
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setGateLoading(false);
                    }
                  }}
                  className="flex-1 bg-ok/15 text-ok border border-emerald-500/30 py-2.5 rounded-xl hover:bg-emerald-500/30 transition-all disabled:opacity-50 font-[700] flex items-center justify-center gap-2"
                >
                  <span>🔓</span>
                  {gateLoading ? "..." : "Open"}
                </button>

                <button
                  disabled={!selectedGate || gateLoading}
                  onClick={async () => {
                    if (!selectedGate) return;
                    try {
                      setGateLoading(true);
                      await closeGate(selectedGate.id);
                      setGateOpen(false);
                      updateGateStatus(selectedGate.id, false);
                      setLogs((prev) => [
                        {
                          message: `Gate ${selectedGate.name} closed manually`,
                          queueCount: selectedGate.queueCount || 0,
                          timeDate: formatTimeDate(),
                          gateName: selectedGate.name,
                          level: getCongestionLevel(
                            selectedGate.queueCount || 0,
                          ),
                          isOpen: false,
                        },
                        ...prev,
                      ]);
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setGateLoading(false);
                    }
                  }}
                  className="flex-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 py-2.5 rounded-xl hover:bg-rose-500/30 transition-all disabled:opacity-50 font-[700] flex items-center justify-center gap-2"
                >
                  <span>🔒</span>
                  {gateLoading ? "..." : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* GATE ENTRIES TABLE */}
        <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground font-bold flex items-center gap-2 text-lg">
              <HiOutlineClock className="w-5 h-5" />
              {selectedGate
                ? `Entries for ${selectedGate.name}`
                : "Gate Entry Logs"}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-lg text-muted-foreground bg-card px-3 py-1 rounded-full">
                Total: {filteredEntries.length} entries
              </span>
              <button
                onClick={async () => {
                  const allEntries = await fetchAllGateEntries();
                  if (selectedGate && allEntries.length > 0) {
                    filterEntriesByGate(selectedGate.id, allEntries);
                  }
                }}
                disabled={loadingEntries}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg disabled:opacity-50"
                aria-label="Refresh logs"
              >
                <HiOutlineRefresh className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-[#F2F6FB] dark:bg-slate-800/40 text-[#7C93B4]">
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Time
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Gate Name
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Gate ID
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Plate
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Entry Type
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Entry By
                  </th>
                  <th className="px-6 py-4 text-lg font-bold uppercase tracking-wide text-muted-foreground text-left">
                    Resident
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingEntries ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg text-muted-foreground">
                          Loading entries from API...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-lg text-muted-foreground"
                    >
                      <HiOutlineXCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      {selectedGate
                        ? `No entries found for ${selectedGate.name}`
                        : "No entries available yet"}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => {
                    const residentId =
                      entry.resident_id !== undefined &&
                      entry.resident_id !== null
                        ? String(entry.resident_id)
                        : "N/A";

                    return (
                      <tr
                        key={entry.id || index}
                        className="border-b border-border transition last:border-b-0 hover:bg-secondary dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-mono text-[#3B5473] dark:text-white whitespace-nowrap">
                            {entry.created_at
                              ? new Date(entry.created_at).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  },
                                )
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[18px] font-[500] text-foreground dark:text-white">
                            {entry.gate_id ? getGateName(entry.gate_id) : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-[14px] font-mono bg-slate-800/50 text-[#3B5473] dark:text-white border border-border">
                            {entry.gate_id !== undefined &&
                            entry.gate_id !== null
                              ? entry.gate_id
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-[18px] font-[600] text-[#10b981]">
                            {entry.plate_number || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`
                              inline-flex items-center px-3 py-1 rounded-full text-[14px] font-bold border
                              ${getEntryTypeColor(entry.entry_type)}
                            `}
                          >
                            {entry.entry_type
                              ? entry.entry_type.toUpperCase()
                              : "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[18px] font-[500] text-[#3B5473] dark:text-white">
                            {entry.entry_by || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[18px] font-[500] text-[#3B5473] dark:text-white">
                            {residentId}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-lg text-muted-foreground">
            <span>
              {selectedGate
                ? `Showing ${filteredEntries.length} entries for ${selectedGate.name}`
                : `Total entries: ${entries.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <HiOutlineCog className="w-5 h-5 text-brand" />
                  Traffic Settings
                </h2>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* LIGHT */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">
                      Light
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Maximum value for light traffic
                    </p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: draftSettings.colors.light,
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={draftSettings.light}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        light: Number(e.target.value),
                      }))
                    }
                    className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-brand"
                  />
                  <input
                    type="color"
                    value={draftSettings.colors.light}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        colors: {
                          ...prev.colors,
                          light: e.target.value,
                        },
                      }))
                    }
                    className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
                  />
                </div>
              </div>

              {/* HEAVY */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">
                      Heavy
                    </h3>
                    <p className="text-lg text-muted-foreground text-lg">
                      minimum value for heavy traffic
                    </p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: draftSettings.colors.heavy,
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={draftSettings.heavy}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        heavy: Number(e.target.value),
                      }))
                    }
                    className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-brand"
                  />
                  <input
                    type="color"
                    value={draftSettings.colors.heavy}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        colors: {
                          ...prev.colors,
                          heavy: e.target.value,
                        },
                      }))
                    }
                    className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
                  />
                </div>
              </div>

              {/* MEDIUM */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">
                      Medium
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Calculated automatically
                    </p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: draftSettings.colors.medium,
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-muted-foreground">
                    {mediumThreshold}
                  </div>
                  <input
                    type="color"
                    value={draftSettings.colors.medium}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        colors: {
                          ...prev.colors,
                          medium: e.target.value,
                        },
                      }))
                    }
                    className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
                  />
                </div>
              </div>

              {/* PREVIEW */}
              <div className="bg-slate-900/70 rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Traffic Preview
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 text-center py-2 rounded-lg text-lg font-semibold"
                    style={{
                      backgroundColor: `${draftSettings.colors.light}22`,
                      color: draftSettings.colors.light,
                      border: `1px solid ${draftSettings.colors.light}55`,
                    }}
                  >
                    LIGHT
                    <div className="text-lg opacity-70 mt-1">
                      0 - {mediumThreshold - 1}
                    </div>
                  </div>
                  <div
                    className="flex-1 text-center py-2 rounded-lg text-lg font-semibold"
                    style={{
                      backgroundColor: `${draftSettings.colors.medium}22`,
                      color: draftSettings.colors.medium,
                      border: `1px solid ${draftSettings.colors.medium}55`,
                    }}
                  >
                    MEDIUM
                    <div className="text-lg opacity-70 mt-1">
                      {mediumThreshold} - {draftSettings.heavy - 1}
                    </div>
                  </div>
                  <div
                    className="flex-1 text-center py-2 rounded-lg text-lg font-semibold"
                    style={{
                      backgroundColor: `${draftSettings.colors.heavy}22`,
                      color: draftSettings.colors.heavy,
                      border: `1px solid ${draftSettings.colors.heavy}55`,
                    }}
                  >
                    HEAVY
                    <div className="text-lg opacity-70 mt-1">
                      {draftSettings.heavy}+
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="flex-1 bg-card text-muted-foreground border border-border py-3 rounded-xl hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 bg-blue-500/20 text-brand border border-blue-500/30 py-3 rounded-xl hover:bg-blue-500/30 transition-all font-[700] flex items-center justify-center gap-2"
                >
                  <HiOutlineCheckCircle className="w-5 h-5" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP MODAL */}
      {mapOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <HiOutlineMap className="w-5 h-5 text-brand" />
                  Map
                </h2>
                <p className="text-muted-foreground text-xs mt-1">
                  Upload the background map
                </p>
              </div>
              <button
                onClick={() => {
                  setMapOpen(false);
                  setUploadError(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-foreground text-lg font-semibold flex items-center gap-2">
                <HiOutlinePhotograph className="w-4 h-4" />
                Map Background
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-muted-foreground text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-brand cursor-pointer"
              />

              {uploadError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                  <p className="text-rose-400 text-lg">{uploadError}</p>
                </div>
              )}

              {mapImage && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                  <img
                    src={mapImage}
                    alt="Map preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    disabled={uploadingImage}
                    className="absolute top-2 right-2 p-2 bg-rose-500/80 hover:bg-danger rounded-lg"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setMapOpen(false)}
                className="w-full bg-blue-500/20 text-brand border border-blue-500/30 py-3 rounded-xl hover:bg-blue-500/30 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
