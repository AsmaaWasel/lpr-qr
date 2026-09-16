// =========================
// TYPES
// =========================

export type Resident = {
  id: number;
  full_name: string;
};

export type GateEntry = {
  id: number;

  entry_type: "ENTRY" | "EXIT";
  entry_by: "NORMAL" | "QR";

  entry_by_table_id: number | null;

  image_url: string | null;
  plate_number: string | null;

  resident_id: number | null;

  gate_id: number;

  created_at: string;

  resident: Resident | null;
};

export type Plate = {
  id: number;
  plate_number_full: string;
};

export type GateData = {
  id: number;
  name: string;
  desc: string;
  x?: number;
  y?: number;
  isOpen?: boolean;
  queueCount?: number;
  entryCount?: number;
};

export type CongestionLevel = "light" | "medium" | "heavy";

export type ThresholdSettings = {
  light: number;
  heavy: number;
  colors: {
    light: string;
    medium: string;
    heavy: string;
  };
};

export type LogEntry = {
  message: string;
  queueCount: number;
  timeDate: string;
  gateName: string;
  level: CongestionLevel;
  isOpen: boolean;
};

export type GatePosition = {
  x: number;
  y: number;
};
