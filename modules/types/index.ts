export type Plate = {
  id: number;
  plate_number_full: string;
};

export type Gate = {
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

export type Thresholds = {
  entry: number;
  medium: number;
  heavy: number;
};

export type LogEntry = {
  message: string;
  queueCount: number;
  timeDate: string;
  gateName: string;
  level: CongestionLevel;
  isOpen: boolean;
};
