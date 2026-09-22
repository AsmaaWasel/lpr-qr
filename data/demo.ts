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

export const demoResidents = [
  { id: 101, full_name: "Omar Hassan", phone_number: "+20 100 123 4567", email: "omar@example.com", unit_number: "A-101", status: true, cars: [{ plate_number: "ABC-4821" }] },
  { id: 102, full_name: "Mariam Adel", phone_number: "+20 101 234 5678", email: "mariam@example.com", unit_number: "A-204", status: true, cars: [{ plate_number: "EGY-7743" }] },
  { id: 103, full_name: "Youssef Ali", phone_number: "+20 102 345 6789", email: "youssef@example.com", unit_number: "B-302", status: true, cars: [{ plate_number: "DXB-1880" }] },
  { id: 104, full_name: "Nour Samir", phone_number: "+20 103 456 7890", email: "nour@example.com", unit_number: "C-110", status: false, cars: [{ plate_number: "GIZ-6642" }] },
  { id: 105, full_name: "Salma Khaled", phone_number: "+20 104 567 8901", email: "salma@example.com", unit_number: "C-405", status: true, cars: [{ plate_number: "CAI-5209" }] },
];

export const demoGates = [
  { id: 1, name: "Main Entrance", location: "North Gate", status: "active", is_active: true, entryCount: 128, queueCount: 4 },
  { id: 2, name: "Residents Gate", location: "East Gate", status: "active", is_active: true, entryCount: 96, queueCount: 2 },
  { id: 3, name: "Service Entrance", location: "West Gate", status: "inactive", is_active: false, entryCount: 42, queueCount: 0 },
];

export const demoCameras = [
  { id: 1, name: "Main LPR Camera", camera_name: "Main LPR Camera", ip_address: "192.168.1.21", gate_id: 1, status: "online", is_active: true, camera_type: "LPR" },
  { id: 2, name: "Residents Lane Camera", camera_name: "Residents Lane Camera", ip_address: "192.168.1.22", gate_id: 2, status: "online", is_active: true, camera_type: "LPR" },
  { id: 3, name: "Service Lane Camera", camera_name: "Service Lane Camera", ip_address: "192.168.1.23", gate_id: 3, status: "offline", is_active: false, camera_type: "LPR" },
];

export const demoUnits = [
  { id: 1, unit_number: "A-101", building: "Building A", floor: 1, resident_id: 101, status: "occupied" },
  { id: 2, unit_number: "A-204", building: "Building A", floor: 2, resident_id: 102, status: "occupied" },
  { id: 3, unit_number: "B-302", building: "Building B", floor: 3, resident_id: 103, status: "occupied" },
  { id: 4, unit_number: "C-110", building: "Building C", floor: 1, resident_id: 104, status: "occupied" },
];

export const demoDepartments = [
  { id: 1, name: "Security", description: "Access control and security operations", is_active: true },
  { id: 2, name: "Facility Management", description: "Community facilities and maintenance", is_active: true },
  { id: 3, name: "Administration", description: "Resident and visitor services", is_active: true },
];

export const demoUsers = [
  { id: 1, username: "demo.admin", email: "admin@lpr-demo.com", role: "superAdmin", is_active: true },
  { id: 2, username: "security.operator", email: "operator@lpr-demo.com", role: "security", is_active: true },
  { id: 3, username: "reception", email: "reception@lpr-demo.com", role: "reception", is_active: true },
];

export const demoPlates = demoResidents.flatMap((resident) => resident.cars.map((car, index) => ({
  id: resident.id * 10 + index,
  plate_number: car.plate_number,
  resident_id: resident.id,
  resident: { id: resident.id, full_name: resident.full_name },
  is_active: true,
})));

export const demoReaders = [
  { id: 1, name: "Main Gate Reader", reader_name: "Main Gate Reader", gate_id: 1, status: "online", is_active: true },
  { id: 2, name: "Residents Gate Reader", reader_name: "Residents Gate Reader", gate_id: 2, status: "online", is_active: true },
];

export const demoVisitors = [
  { id: 1, visitor_name: "Ahmed Mostafa", phone_number: "+20 111 222 3333", plate_number: "VIP-3007", resident_id: 101, status: "approved", visit_date: at(11, 42) },
  { id: 2, visitor_name: "Lina George", phone_number: "+20 112 333 4444", plate_number: "VIS-9910", resident_id: 103, status: "pending", visit_date: at(13, 28) },
];

export const demoQrCodes = [
  { id: 1, code: "DEMO-OMAR-101", resident_id: 101, status: "active", max_uses: 10, used_count: 3, created_at: at(8, 0) },
  { id: 2, code: "DEMO-VISITOR-202", resident_id: null, status: "active", max_uses: 5, used_count: 1, created_at: at(10, 30) },
];
