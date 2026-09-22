// @ts-nocheck
"use client"

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { getPlates } from "@/services/plate";
import { getGateEntry, getGates } from "@/services/gate";
import { openGate, closeGate } from "@/services/access-control";

import GateMap from "@/components/real-time/GateMap";
import TrafficSettings from "@/components/real-time/TrafficSettings";
import GateEntriesTable from "@/components/real-time/GateEntriesTable";
import GatesTable from "@/components/real-time/GatesTable";

import { GateData, GateEntry } from "@/modules/types/gateEntry";
import { PillTabs } from "@/shared/ui/voom";
import Gate from "@/modules/sharedComponents/gate-entries/Gate";

// =====================================================
// TYPES
// =====================================================

type CongestionLevel = "light" | "medium" | "heavy";

type GateStatus = "closed" | "opening" | "open" | "closing";

export type ThresholdSettings = {
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

type GateItem = GateData & {
  x?: number;
  y?: number;
  isOpen?: boolean;
  status?: GateStatus;
  queueCount?: number;
  entryCount?: number;
};

// =====================================================
// WEBSOCKET EVENT
// =====================================================

type WebSocketEvent = {
  event: string;
  request_id?: string | null;
  gate_id?: number | null;
  camera_id?: number | null;

  data?: {
    plate_number?: string;
    image_url?: string;
    processing_ms?: number;
    message?: string;
    [key: string]: unknown;
  };
};

// =====================================================
// TABS
// =====================================================

const LPR_TABS = [
  {
    label: "Real Time Gates",
    href: "/dashboard/lpr/real-time",
  },
  {
    label: "Gates",
    href: "/dashboard/lpr/gates",
  },
  {
    label: "Cameras",
    href: "/dashboard/lpr/cameras",
  },
  {
    label: "Plates",
    href: "/dashboard/lpr/plates",
  },
];

// =====================================================
// PAGE
// =====================================================

export default function LiveDemoPage() {
  // =====================================================
  // DATA STATES
  // =====================================================

  const [gates, setGates] = useState<GateItem[]>([]);
  const [selectedGate, setSelectedGate] = useState<GateItem | null>(null);

  const [entries, setEntries] = useState<GateEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<GateEntry[]>([]);

  // =====================================================
  // WEBSOCKET
  // =====================================================

  const wsRef = useRef<WebSocket | null>(null);

  const currentRequestIdRef = useRef<string | null>(null);

  const [wsConnected, setWsConnected] = useState(false);

  // =====================================================
  // GATE ANIMATION TIMERS
  // =====================================================

  const gateTimersRef = useRef<Record<number, number>>({});

  // =====================================================
  // ACCESS CYCLE
  // =====================================================

  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const [accessEvent, setAccessEvent] = useState<string>("");

  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);

  const [plateImage, setPlateImage] = useState<string | null>(null);

  const [processingMs, setProcessingMs] = useState<number | null>(null);

  const [qrRequired, setQrRequired] = useState(false);

  // =====================================================
  // GATE CONTROL
  // =====================================================

  const [gateOpen, setGateOpen] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "processing" | "granted" | "denied" | "qr_required"
  >("idle");

  const [gateLoading, setGateLoading] = useState(false);

  // =====================================================
  // LOGS
  // =====================================================

  const [logs, setLogs] = useState<LogEntry[]>([]);

  // =====================================================
  // LOADING
  // =====================================================

  const [isLoading, setIsLoading] = useState(true);

  const [loadingEntries, setLoadingEntries] = useState(false);

  // =====================================================
  // SETTINGS
  // =====================================================

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [draftSettings, setDraftSettings] =
    useState<ThresholdSettings>(DEFAULT_SETTINGS);

  const [trafficSettings, setTrafficSettings] = useState<ThresholdSettings>(
    () => {
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
            ...(parsed?.colors ?? {}),
          },
        };
      } catch (error) {
        console.error("Error loading traffic settings:", error);

        return DEFAULT_SETTINGS;
      }
    },
  );

  // =====================================================
  // MAP
  // =====================================================

  const [mapOpen, setMapOpen] = useState(false);

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

  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =====================================================
  // GATE POSITIONS
  // =====================================================

  const [gatePositions, setGatePositions] = useState<
    Record<
      string,
      {
        x: number;
        y: number;
      }
    >
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

  // =====================================================
  // HTML DRAG & DROP
  // =====================================================

  const [draggedGate, setDraggedGate] = useState<GateItem | null>(null);

  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);

  // =====================================================
  // POINTER DRAG
  // =====================================================

  const [isPointerDragging, setIsPointerDragging] = useState(false);

  const [activeDragGateId, setActiveDragGateId] = useState<string | null>(null);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatTimeDate = () => {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getGateName = (gateId: number) => {
    const gate = gates.find((gate) => gate.id === gateId);

    return gate?.name || `Gate ${gateId}`;
  };

  // =====================================================
  // CONGESTION
  // =====================================================

  const getCongestionLevelByEntryCount = useCallback(
    (entryCount: number): CongestionLevel => {
      const { light, heavy } = trafficSettings;

      const medium = Math.floor((light + heavy) / 2);

      if (entryCount >= heavy) {
        return "heavy";
      }

      if (entryCount >= medium) {
        return "medium";
      }

      return "light";
    },
    [trafficSettings],
  );

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

  const getLevelTextColor = (level: CongestionLevel) => {
    if (level === "heavy") {
      return "text-rose-400";
    }

    if (level === "medium") {
      return "text-warn";
    }

    return "text-ok";
  };

  // =====================================================
  // ENTRY TYPE
  // =====================================================

  const getEntryTypeColor = (type?: string | null) => {
    if (!type) {
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }

    const normalizedType = type.toLowerCase();

    if (normalizedType === "entry" || normalizedType === "in") {
      return "bg-ok/15 text-ok border-emerald-500/30";
    }

    if (normalizedType === "exit" || normalizedType === "out") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    }

    return "bg-blue-500/20 text-brand border-blue-500/30";
  };

  // =====================================================
  // CLEAR GATE TIMER
  // =====================================================

  const clearGateTimer = useCallback((gateId: number) => {
    const timer = gateTimersRef.current[gateId];

    if (timer) {
      window.clearTimeout(timer);

      delete gateTimersRef.current[gateId];
    }
  }, []);

  // =====================================================
  // UPDATE GATE STATUS
  // =====================================================

  const updateGateStatus = useCallback(
    (gateId: number, isOpen: boolean, gateStatus: GateStatus) => {
      console.log("🚧 UPDATE GATE STATUS:", {
        gateId,
        isOpen,
        status: gateStatus,
      });

      setGates((prevGates) =>
        prevGates.map((gate) =>
          gate.id === gateId
            ? {
                ...gate,
                isOpen,
                status: gateStatus,
              }
            : gate,
        ),
      );

      setSelectedGate((prev) =>
        prev?.id === gateId
          ? {
              ...prev,
              isOpen,
              status: gateStatus,
            }
          : prev,
      );
    },
    [],
  );

  // =====================================================
  // MANUAL OPEN GATE
  // =====================================================

  const handleManualOpenGate = async () => {
    if (!selectedGate) return;

    try {
      setGateLoading(true);

      await openGate(selectedGate.id);

      setGateOpen(true);

      updateGateStatus(selectedGate.id, true, "open");

      setLogs((prev) => [
        {
          message: `Gate ${selectedGate.name} opened manually`,
          queueCount: selectedGate.queueCount || 0,
          timeDate: formatTimeDate(),
          gateName: selectedGate.name,
          level: getCongestionLevel(selectedGate.queueCount || 0),
          isOpen: true,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error opening gate manually:", error);
    } finally {
      setGateLoading(false);
    }
  };

  // =====================================================
  // MANUAL CLOSE GATE
  // =====================================================

  const handleManualCloseGate = async () => {
    if (!selectedGate) return;

    try {
      setGateLoading(true);

      await closeGate(selectedGate.id);

      setGateOpen(false);

      updateGateStatus(selectedGate.id, false, "closed");

      setLogs((prev) => [
        {
          message: `Gate ${selectedGate.name} closed manually`,
          queueCount: selectedGate.queueCount || 0,
          timeDate: formatTimeDate(),
          gateName: selectedGate.name,
          level: getCongestionLevel(selectedGate.queueCount || 0),
          isOpen: false,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error closing gate manually:", error);
    } finally {
      setGateLoading(false);
    }
  };

  // =====================================================
  // WEBSOCKET EVENT HANDLER
  // =====================================================

  const handleWebSocketEvent = useCallback(
    (event: WebSocketEvent) => {
      console.log("========== WS EVENT ==========");

      console.log("Event:", event.event);

      console.log("Request ID:", event.request_id);

      console.log("Gate ID:", event.gate_id);

      console.log("Camera ID:", event.camera_id);

      console.log("Data:", event.data);

      console.log("==============================");

      // =================================================
      // CONNECTED
      // =================================================

      if (event.event === "CONNECTED") {
        console.log("WebSocket connection confirmed");

        setAccessEvent("CONNECTED");

        return;
      }

      // =================================================
      // REQUEST ID FILTER
      // =================================================

      if (
        currentRequestIdRef.current &&
        event.request_id &&
        event.request_id !== currentRequestIdRef.current
      ) {
        console.log("Ignoring event from another request:", event.request_id);

        return;
      }

      // =================================================
      // SAVE REQUEST ID
      // =================================================

      if (event.request_id) {
        currentRequestIdRef.current = event.request_id;

        setActiveRequestId(event.request_id);
      }

      // =================================================
      // CURRENT EVENT
      // =================================================

      setAccessEvent(event.event);

      // =================================================
      // GATE EVENTS
      // =================================================

      if (event.gate_id != null) {
        const gateId = event.gate_id;

        switch (event.event) {
          // ---------------------------------------------
          // OPENING
          // ---------------------------------------------

          case "GATE_OPENING": {
            console.log("🟡 GATE_OPENING:", gateId);

            clearGateTimer(gateId);

            updateGateStatus(gateId, true, "opening");

            setGateOpen(true);
            setGateLoading(true);

            break;
          }

          // ---------------------------------------------
          // OPENED
          // ---------------------------------------------

          case "GATE_OPENED": {
            console.log("🟢 GATE_OPENED:", gateId);

            clearGateTimer(gateId);

            updateGateStatus(gateId, true, "opening");

            setGateOpen(true);
            setGateLoading(false);

            const timer = window.setTimeout(() => {
              console.log("🟢 Gate fully OPEN:", gateId);

              updateGateStatus(gateId, true, "open");

              delete gateTimersRef.current[gateId];
            }, 1500);

            gateTimersRef.current[gateId] = timer;

            break;
          }

          // ---------------------------------------------
          // CLOSING
          // ---------------------------------------------

          case "GATE_CLOSING": {
            console.log("🟠 GATE_CLOSING:", gateId);

            clearGateTimer(gateId);

            updateGateStatus(gateId, true, "closing");

            setGateOpen(true);
            setGateLoading(true);

            break;
          }

          // ---------------------------------------------
          // CLOSED
          // ---------------------------------------------

          case "GATE_CLOSED": {
            console.log("🔴 GATE_CLOSED:", gateId);

            clearGateTimer(gateId);

            updateGateStatus(gateId, false, "closed");

            setGateOpen(false);
            setGateLoading(false);

            break;
          }

          default:
            break;
        }
      }

      // =================================================
      // ACCESS EVENT SWITCH
      // =================================================

      switch (event.event) {
        // ---------------------------------------------
        // LOOP
        // ---------------------------------------------

        case "LOOP_TRIGGERED": {
          setStatus("processing");
          setGateLoading(true);

          break;
        }

        // ---------------------------------------------
        // LPR
        // ---------------------------------------------

        case "LPR_PROCESSING": {
          setStatus("processing");
          setGateLoading(true);

          break;
        }

        // ---------------------------------------------
        // PLATE
        // ---------------------------------------------

        case "PLATE_DETECTED": {
          const plateNumber = event.data?.plate_number ?? null;

          const imageUrl = event.data?.image_url ?? null;

          const processingTime =
            typeof event.data?.processing_ms === "number"
              ? event.data.processing_ms
              : null;

          setDetectedPlate(plateNumber);

          setPlateImage(imageUrl);

          setProcessingMs(processingTime);

          setStatus("processing");

          break;
        }

        // ---------------------------------------------
        // ACCESS GRANTED
        // ---------------------------------------------

        case "ACCESS_GRANTED": {
          setStatus("granted");
          setGateLoading(false);
          setQrRequired(false);

          break;
        }

        // ---------------------------------------------
        // QR REQUIRED
        // ---------------------------------------------

        case "QR_REQUIRED":
        case "ACCESS_REQUIRES_QR": {
          setStatus("qr_required");

          setQrRequired(true);
          setGateLoading(false);

          break;
        }

        // ---------------------------------------------
        // QR PROCESSING
        // ---------------------------------------------

        case "QR_PROCESSING": {
          setStatus("processing");
          setQrRequired(true);
          setGateLoading(true);

          break;
        }

        // ---------------------------------------------
        // QR DETECTED
        // ---------------------------------------------

        case "QR_DETECTED": {
          setQrRequired(false);
          setStatus("processing");

          break;
        }

        // ---------------------------------------------
        // QR INVALID
        // ---------------------------------------------

        case "QR_INVALID": {
          setStatus("denied");
          setGateLoading(false);
          setQrRequired(true);

          break;
        }

        // ---------------------------------------------
        // ACCESS DENIED
        // ---------------------------------------------

        case "ACCESS_DENIED": {
          setStatus("denied");
          setGateLoading(false);

          break;
        }

        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        case "ERROR": {
          setStatus("denied");
          setGateLoading(false);

          console.error("Access cycle error:", event.data);

          break;
        }

        // ---------------------------------------------
        // DEFAULT
        // ---------------------------------------------

        default: {
          console.log("Unhandled WebSocket event:", event.event);
        }
      }
    },
    [clearGateTimer, updateGateStatus],
  );

  // =====================================================
  // WEBSOCKET CONNECTION
  // =====================================================

  useEffect(() => {
    console.log("Connecting to WebSocket...");

    const socket = new WebSocket("ws://localhost:8000/ws");

    wsRef.current = socket;

    socket.onopen = () => {
      console.log("=================================");

      console.log("WebSocket connected");

      console.log("=================================");

      setWsConnected(true);
    };

    socket.onmessage = (message) => {
      console.log("🔥 BACKEND WS MESSAGE:", message.data);

      try {
        const event = JSON.parse(message.data) as WebSocketEvent;

        console.log("🔥 EVENT NAME:", event.event);

        console.log("🔥 REQUEST ID:", event.request_id);

        console.log("🔥 GATE ID:", event.gate_id);

        console.log("🔥 CAMERA ID:", event.camera_id);

        console.log("🔥 DATA:", event.data);

        handleWebSocketEvent(event);
      } catch (error) {
        console.error("WS JSON ERROR:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);

      setWsConnected(false);
    };

    socket.onclose = (event) => {
      console.log("WebSocket disconnected");

      console.log("Code:", event.code);

      console.log("Reason:", event.reason);

      setWsConnected(false);

      wsRef.current = null;
    };

    return () => {
      console.log("Closing WebSocket...");

      socket.close();

      wsRef.current = null;
    };
  }, [handleWebSocketEvent]);

  // =====================================================
  // CLEAR ALL GATE TIMERS ON UNMOUNT
  // =====================================================

  useEffect(() => {
    return () => {
      Object.values(gateTimersRef.current).forEach((timer) => {
        window.clearTimeout(timer);
      });

      gateTimersRef.current = {};
    };
  }, []);

  // =====================================================
  // FETCH GATE ENTRIES
  // =====================================================

  const fetchAllGateEntries = useCallback(async () => {
    try {
      setLoadingEntries(true);

      const data = await getGateEntry();

      console.log("All gate entries received:", data);

      const entriesArray = Array.isArray(data) ? data : [];

      setEntries(entriesArray);

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
      setFilteredEntries([]);

      return [];
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  // =====================================================
  // FILTER ENTRIES
  // =====================================================

  const filterEntriesByGate = useCallback(
    (gateId: number, allEntries: GateEntry[]) => {
      const filtered = allEntries.filter((entry) => entry.gate_id === gateId);

      setFilteredEntries(filtered);
    },
    [],
  );

  // =====================================================
  // SELECT GATE
  // =====================================================

  const handleGateSelect = useCallback(
    (gate: GateItem) => {
      setSelectedGate(gate);

      setGateOpen(
        (gate.isOpen ?? gate.status === "open") || gate.status === "opening",
      );

      setStatus("idle");

      if (gate.id) {
        filterEntriesByGate(gate.id, entries);
      } else {
        setFilteredEntries([]);
      }
    },
    [entries, filterEntriesByGate],
  );

  // =====================================================
  // INITIAL DATA LOAD
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);

        console.log("Starting initial data load...");

        const gateData = await getGates();

        console.log("Gates received:", gateData);

        if (!isMounted) {
          return;
        }

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

        const mapped: GateItem[] = gatesArray.map(
          (gate: GateData, index: number) => ({
            ...gate,

            x: positions[index % positions.length].x,

            y: positions[index % positions.length].y,

            isOpen: false,

            status: "closed",

            queueCount: 0,

            entryCount: 0,
          }),
        );

        const mappedWithPositions = mapped.map((gate) => {
          const savedPos = gatePositions[String(gate.id)];

          if (savedPos) {
            return {
              ...gate,
              x: savedPos.x,
              y: savedPos.y,
            };
          }

          return gate;
        });

        setGates(mappedWithPositions);

        const allEntries = await fetchAllGateEntries();

        if (!isMounted) {
          return;
        }

        if (mappedWithPositions.length > 0) {
          const firstGate = mappedWithPositions[0];

          setSelectedGate(firstGate);

          setGateOpen(firstGate.isOpen ?? false);

          if (firstGate.id) {
            filterEntriesByGate(firstGate.id, allEntries);
          }
        }

        await getPlates();

        if (!isMounted) {
          return;
        }

        console.log("Initial data loaded successfully");
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

  // =====================================================
  // MAP
  // =====================================================

  const openMap = () => {
    setMapOpen(true);
    setUploadError(null);
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

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
        const imageData = event.target?.result;

        if (typeof imageData !== "string") {
          throw new Error("Invalid image data");
        }

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

  // =====================================================
  // REMOVE MAP IMAGE
  // =====================================================

  const removeImage = () => {
    setMapImage(null);

    localStorage.removeItem("mapImage");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setUploadError(null);
  };

  // =====================================================
  // HTML DRAG START
  // =====================================================

  const handleDragStart = (e: React.DragEvent, gate: GateItem) => {
    setDraggedGate(gate);

    setIsDragging(true);

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData("text/plain", String(gate.id));
  };

  // =====================================================
  // HTML DRAG OVER
  // =====================================================

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    if (!mapRef.current) {
      return;
    }

    const rect = mapRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;

    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDragPosition({
      x: Math.min(95, Math.max(5, x)),

      y: Math.min(95, Math.max(5, y)),
    });
  };

  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(false);

    if (!mapRef.current || !draggedGate) {
      setDraggedGate(null);
      setDragPosition(null);

      return;
    }

    const rect = mapRef.current.getBoundingClientRect();

    let x = ((e.clientX - rect.left) / rect.width) * 100;

    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.min(95, Math.max(5, x));

    y = Math.min(95, Math.max(5, y));

    setGatePositions((prev) => {
      const updated = {
        ...prev,

        [String(draggedGate.id)]: {
          x,
          y,
        },
      };

      localStorage.setItem("gatePositions", JSON.stringify(updated));

      return updated;
    });

    setGates((prevGates) =>
      prevGates.map((gate) =>
        gate.id === draggedGate.id
          ? {
              ...gate,
              x,
              y,
            }
          : gate,
      ),
    );

    if (selectedGate?.id === draggedGate.id) {
      setSelectedGate((prev) =>
        prev
          ? {
              ...prev,
              x,
              y,
            }
          : null,
      );
    }

    setLogs((prev) => [
      {
        message: `Gate ${draggedGate.name} repositioned on map`,
        queueCount: draggedGate.queueCount ?? 0,
        timeDate: formatTimeDate(),
        gateName: draggedGate.name,
        level: getCongestionLevel(draggedGate.queueCount ?? 0),
        isOpen: draggedGate.isOpen ?? false,
      },

      ...prev,
    ]);

    setDraggedGate(null);
    setDragPosition(null);
  };

  // =====================================================
  // DRAG END
  // =====================================================

  const handleDragEnd = () => {
    setIsDragging(false);

    setDraggedGate(null);

    setDragPosition(null);
  };

  // =====================================================
  // POINTER DOWN
  // =====================================================

  const handleGatePointerDown = (e: React.PointerEvent, gateId: string) => {
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;

    target.setPointerCapture(e.pointerId);

    setIsPointerDragging(true);

    setActiveDragGateId(gateId);
  };

  // =====================================================
  // POINTER MOVE
  // =====================================================

  const handleGatePointerMove = (e: React.PointerEvent, gateId: string) => {
    if (!isPointerDragging || activeDragGateId !== gateId) {
      return;
    }

    const mapElement = mapRef.current;

    if (!mapElement) {
      return;
    }

    const rect = mapElement.getBoundingClientRect();

    let x = ((e.clientX - rect.left) / rect.width) * 100;

    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.min(95, Math.max(5, x));

    y = Math.min(95, Math.max(5, y));

    setGatePositions((prev) => {
      const updated = {
        ...prev,

        [gateId]: {
          x,
          y,
        },
      };

      localStorage.setItem("gatePositions", JSON.stringify(updated));

      return updated;
    });

    setGates((prevGates) =>
      prevGates.map((gate) =>
        gate.id === Number(gateId)
          ? {
              ...gate,
              x,
              y,
            }
          : gate,
      ),
    );

    setSelectedGate((prev) =>
      prev?.id === Number(gateId)
        ? {
            ...prev,
            x,
            y,
          }
        : prev,
    );
  };

  // =====================================================
  // POINTER UP
  // =====================================================

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

  // =====================================================
  // SETTINGS
  // =====================================================

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

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-muted-foreground mt-4">Loading system data...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-4">
      {/* =================================================
          TABS
      ================================================= */}

      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/real-time" />

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            {/* WebSocket Status */}

            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  wsConnected ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />

              <span className="text-sm text-muted-foreground">
                WebSocket:{" "}
                <span className={wsConnected ? "text-ok" : "text-rose-400"}>
                  {wsConnected ? "Connected" : "Disconnected"}
                </span>
              </span>
            </div>

            {/* Request */}

            {activeRequestId && (
              <div className="text-xs text-muted-foreground">
                Request: <span className="font-mono">{activeRequestId}</span>
              </div>
            )}

            {/* Current Event */}

            {accessEvent && (
              <div className="text-sm text-brand font-medium">
                {accessEvent}
              </div>
            )}

            {/* Plate */}

            {detectedPlate && (
              <div className="text-lg font-semibold">
                Plate: <span className="text-brand">{detectedPlate}</span>
              </div>
            )}
          </div>

          {/* RIGHT ACTIONS */}

          <div className="flex items-center gap-6">
            {/* MAP */}

            <button
              type="button"
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

              <span className="text-lg font-medium">Map</span>
            </button>

            {/* SETTINGS */}

            <button
              type="button"
              onClick={openSettings}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg flex items-center gap-2"
              aria-label="Settings"
            >
              <span className="text-lg">⚙</span>

              <span className="text-lg font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* =================================================
            ACCESS STATUS
        ================================================= */}

        {(status !== "idle" || detectedPlate || qrRequired) && (
          <div className="mb-6 rounded-xl border border-border bg-background/50 p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* STATUS */}

              <div>
                <p className="text-xs text-muted-foreground">Access Status</p>

                <p
                  className={`text-lg font-semibold ${
                    status === "granted"
                      ? "text-ok"
                      : status === "denied"
                        ? "text-rose-400"
                        : status === "qr_required"
                          ? "text-warn"
                          : "text-brand"
                  }`}
                >
                  {status === "granted"
                    ? "Access Granted"
                    : status === "denied"
                      ? "Access Denied"
                      : status === "qr_required"
                        ? "QR Required"
                        : status === "processing"
                          ? "Processing..."
                          : "Idle"}
                </p>
              </div>

              {/* EVENT */}

              {accessEvent && (
                <div>
                  <p className="text-xs text-muted-foreground">Current Event</p>

                  <p className="text-sm font-medium">{accessEvent}</p>
                </div>
              )}

              {/* PLATE */}

              {detectedPlate && (
                <div>
                  <p className="text-xs text-muted-foreground">Plate Number</p>

                  <p className="text-lg font-bold text-brand">
                    {detectedPlate}
                  </p>
                </div>
              )}

              {/* PROCESSING TIME */}

              {processingMs !== null && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    LPR Processing
                  </p>

                  <p className="text-sm font-medium">
                    {processingMs.toFixed(0)} ms
                  </p>
                </div>
              )}

              {/* QR */}

              {qrRequired && (
                <div className="px-3 py-2 rounded-lg bg-warn/10 border border-warn/30">
                  <p className="text-sm text-warn font-medium">
                    Waiting for QR
                  </p>
                </div>
              )}

              {/* GATE */}

              <div>
                <p className="text-xs text-muted-foreground">Gate</p>

                <p
                  className={`text-sm font-medium ${
                    gateOpen ? "text-ok" : "text-muted-foreground"
                  }`}
                >
                  {gateOpen ? "OPEN" : "CLOSED"}
                </p>
              </div>

              {/* LOADING */}

              {gateLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />

                  <span className="text-xs text-muted-foreground">
                    Processing
                  </span>
                </div>
              )}
            </div>

            {/* PLATE IMAGE */}

            {plateImage && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Captured Image
                </p>

                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={plateImage}
                    alt="Detected plate"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================
            GATES TABLE
        ================================================= */}

        <div className="w-full">
          <GatesTable
            gates={gates}
            selectedGate={selectedGate}
            handleGateSelect={handleGateSelect}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            getCongestionLevelByEntryCount={getCongestionLevelByEntryCount}
          />
        </div>

        {/* =================================================
            MAP (LEFT) + MANUAL CONTROL (RIGHT)
        ================================================= */}

        <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: HEAT MAP */}

          <div className="lg:col-span-8">
            <GateMap
              open={mapOpen}
              onClose={() => {
                setMapOpen(false);
                setUploadError(null);
              }}
              gates={gates}
              mapImage={mapImage}
              gatePositions={gatePositions}
              getCongestionLevelByEntryCount={getCongestionLevelByEntryCount}
              getLevelTextColor={getLevelTextColor}
              onGateSelect={handleGateSelect}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onPointerDown={handleGatePointerDown}
              onPointerMove={handleGatePointerMove}
              onPointerUp={handlePointerUp}
              mapRef={mapRef}
              isDragging={isDragging}
              draggedGate={draggedGate}
              dragPosition={dragPosition}
              uploadingImage={uploadingImage}
              uploadError={uploadError}
              fileInputRef={fileInputRef}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
              singleArm // ✅ ذراع واحد فقط
            />
          </div>

          {/* RIGHT: MANUAL CONTROL BOX */}

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-border bg-background/50 p-5 h-full flex flex-col">
              {/* TITLE */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Gate Control</h3>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    gateOpen
                      ? "bg-ok/15 text-ok border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {gateOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>

              {/* SELECTED GATE INFO */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Selected Gate</p>

                <h4 className="text-xl font-bold">
                  {selectedGate?.name || "No Gate Selected"}
                </h4>

                <p className="text-sm text-muted-foreground">
                  {selectedGate?.desc || "Select a gate to control"}
                </p>

                {selectedGate && (
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span>
                      <span className="text-muted-foreground">Traffic: </span>

                      <span
                        className={`font-semibold ${getLevelTextColor(
                          getCongestionLevelByEntryCount(
                            selectedGate.entryCount || 0,
                          ),
                        )}`}
                      >
                        {getCongestionLevelByEntryCount(
                          selectedGate.entryCount || 0,
                        ).toUpperCase()}
                      </span>
                    </span>

                    <span>
                      <span className="text-muted-foreground">Entries: </span>

                      <span className="font-semibold">
                        {selectedGate.entryCount || 0}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* GATE ANIMATION */}
              <div className="rounded-xl bg-secondary/40 border border-border p-4 flex flex-col items-center mb-4">
                {/* Gate moved slightly down */}
                <div className="mt-23">
                  <Gate open={gateOpen} size="md" />
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  {gateOpen ? "Gate is OPEN" : "Gate is CLOSED"}
                </p>
              </div>

              {/* MANUAL CONTROLS */}
              <div className="mt-auto flex flex-col gap-3">
                <p className="text-xs text-muted-foreground text-center">
                  Manual Control
                </p>

                <div className="flex gap-3">
                  {/* OPEN */}
                  <button
                    type="button"
                    disabled={!selectedGate || gateLoading}
                    onClick={handleManualOpenGate}
                    className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-3 px-4 rounded-xl hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <span>🔓</span>

                    {gateLoading ? "..." : "Open"}
                  </button>

                  {/* CLOSE */}
                  <button
                    type="button"
                    disabled={!selectedGate || gateLoading}
                    onClick={handleManualCloseGate}
                    className="flex-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 py-3 px-4 rounded-xl hover:bg-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <span>🔒</span>

                    {gateLoading ? "..." : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            GATE ENTRIES
        ================================================= */}

        <div className="w-full mt-6">
          <GateEntriesTable
            entries={entries}
            filteredEntries={filteredEntries}
            selectedGate={selectedGate}
            loadingEntries={loadingEntries}
            getGateName={getGateName}
            getEntryTypeColor={getEntryTypeColor}
            onRefresh={async () => {
              const allEntries = await fetchAllGateEntries();

              if (selectedGate) {
                filterEntriesByGate(selectedGate.id, allEntries);
              } else {
                setFilteredEntries([]);
              }
            }}
          />
        </div>
      </div>

      {/* =================================================
          TRAFFIC SETTINGS MODAL
      ================================================= */}

      <TrafficSettings
        open={settingsOpen}
        settings={draftSettings}
        onChange={(field, value) => {
          setDraftSettings((prev) => ({
            ...prev,
            [field]: value,
          }));
        }}
        onColorChange={(field, value) => {
          setDraftSettings((prev) => ({
            ...prev,

            colors: {
              ...prev.colors,
              [field]: value,
            },
          }));
        }}
        onSave={saveSettings}
        onClose={() => {
          setSettingsOpen(false);

          setDraftSettings(trafficSettings);
        }}
      />
    </div>
  );
}
