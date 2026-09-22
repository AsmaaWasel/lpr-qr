import api from "./api";

// =========================
// TYPES
// =========================

export type VisitorPhoneNumber = {
  id: number;
  phone_number: string;
};

export type VisitorResident = {
  id: number;
  full_name: string;
  full_name_ar: string | null;
  phone_numbers: VisitorPhoneNumber[];
  driving_license: string | null;
  national_id: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  subscribed: boolean;
  owner_id: number | null;
  face_id: string | null;
  front_face_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatedBy = {
  id: number;
  type: string;
  name: string;
};

export type VisitorLog = {
  id: number;

  qr_code_id: number | null;

  resident_id: number | null;

  resident: VisitorResident | null;

  visitor_national_id: string | null;

  visitor_phone_number: string | null;

  visitor_full_name: string | null;

  image_url: string | null;

  created_by: CreatedBy | null;

  plate_number: string | null;

  entry_time: string | null;

  exit_time: string | null;

  status: string;

  created_at: string;
};

// =========================
// GET VISITOR LOGS
// =========================

export const getVisitorLogs = async (
  skip = 0,
  limit = 50,
): Promise<VisitorLog[]> => {
  const res = await api.get<VisitorLog[]>(
    `/visitor-logs/?skip=${skip}&limit=${limit}`,
  );

  console.log("GET /visitor-logs:", res.data);

  return res.data;
};
