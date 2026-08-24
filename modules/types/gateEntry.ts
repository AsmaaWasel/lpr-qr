// =========================
// TYPES
// =========================
export type GateEntry = {
  entry_type: "ENTRY" | "EXIT";
  entry_by: string;
  entry_by_table_id: number;
  image_url: string;
  plate_number: string;
  resident_id: number;
  gate_id: number;
  id: number;
  created_at: string;
  entry_time: string;
  status: "pending" | "rejected";
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
