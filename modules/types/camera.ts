// types/camera.ts
export type Camera = {
  id: number;
  gate_id: number;
  location: string;
  username: string;
  password: string;
  ip_address: string;
  url: string;
  port: number;
  notes: string;
  add_string_to_url: string;
};

// =========================
// TYPES
// =========================
export type CameraFormData = {
  gate_id: number;
  location: string;
  username: string;
  password: string;
  ip_address: string;
  port: string;
  notes: string;
  add_string_to_url: string;
};

export interface ReaderFormData {
  gate_id: number;
  location: string;
  username: string;
  password: string;
  ip_address: string;
  port: string;
  notes: string;
  reader_type: string;
  add_string_to_url: string;
}
