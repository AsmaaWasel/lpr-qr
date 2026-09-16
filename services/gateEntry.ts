// services/gateEntries.ts
import api from "./api";

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

export const getGateEntries = async (): Promise<GateEntry[]> => {
  const res = await api.get<GateEntry[]>("/gate-entries/");
  return res.data;
};
