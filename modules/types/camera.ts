export type Camera = {
  id: number;
  url: string;
  gate_id?: number;
  location?: string;
  username?: string;
  password?: string;
  ip_address?: string;
  port?: number;
  notes?: string;
  reader_type?: string;
  add_string_to_url?: string;
  is_active?: boolean;
  latency?: string;
};

export type CameraFormData = {
  gate_id: number;
  location: string;
  username: string;
  password: string;
  ip_address: string;
  port: number;
  notes: string;
  reader_type: string;
  add_string_to_url: string;
};

export type ReaderFormData = CameraFormData;
