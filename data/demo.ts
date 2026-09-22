import type { GateEntry } from "@/services/gateEntry";

const today = new Date();

const at = (hours: number, minutes: number) => {
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const demoGateEntries: GateEntry[] = [
  { id: 1, entry_type: "ENTRY", entry_by: "NORMAL", entry_by_table_id: 11, image_url: null, plate_number: "ABC-4821", resident_id: 101, gate_id: 1, created_at: at(8, 12), resident: { id: 101, full_name: "Omar Hassan" } },
  { id: 2, entry_type: "ENTRY", entry_by: "QR", entry_by_table_id: 22, image_url: null, plate_number: "KSA-9012", resident_id: null, gate_id: 2, created_at: at(8, 34), resident: null },
  { id: 3, entry_type: "EXIT", entry_by: "NORMAL", entry_by_table_id: 13, image_url: null, plate_number: "EGY-7743", resident_id: 102, gate_id: 1, created_at: at(9, 5), resident: { id: 102, full_name: "Mariam Adel" } },
  { id: 4, entry_type: "ENTRY", entry_by: "NORMAL", entry_by_table_id: 14, image_url: null, plate_number: "DXB-1880", resident_id: 103, gate_id: 3, created_at: at(10, 18), resident: { id: 103, full_name: "Youssef Ali" } },
  { id: 5, entry_type: "ENTRY", entry_by: "QR", entry_by_table_id: 25, image_url: null, plate_number: "VIP-3007", resident_id: null, gate_id: 2, created_at: at(11, 42), resident: null },
  { id: 6, entry_type: "ENTRY", entry_by: "NORMAL", entry_by_table_id: 16, image_url: null, plate_number: "ABC-4821", resident_id: 101, gate_id: 1, created_at: at(12, 16), resident: { id: 101, full_name: "Omar Hassan" } },
  { id: 7, entry_type: "EXIT", entry_by: "QR", entry_by_table_id: 27, image_url: null, plate_number: "VIS-9910", resident_id: null, gate_id: 3, created_at: at(13, 28), resident: null },
  { id: 8, entry_type: "ENTRY", entry_by: "NORMAL", entry_by_table_id: 18, image_url: null, plate_number: "GIZ-6642", resident_id: 104, gate_id: 2, created_at: at(14, 51), resident: { id: 104, full_name: "Nour Samir" } },
  { id: 9, entry_type: "ENTRY", entry_by: "QR", entry_by_table_id: 29, image_url: null, plate_number: "VIS-2104", resident_id: null, gate_id: 1, created_at: at(16, 7), resident: null },
  { id: 10, entry_type: "ENTRY", entry_by: "NORMAL", entry_by_table_id: 20, image_url: null, plate_number: "CAI-5209", resident_id: 105, gate_id: 3, created_at: at(18, 23), resident: { id: 105, full_name: "Salma Khaled" } },
];

export const DEMO_USER = {
  id: 1,
  username: "demo.admin",
  email: "admin@lpr-demo.com",
  role: "superAdmin" as const,
};
