// modules/types/resident.ts
export type Resident = {
  plate_number_full?: string;
  car?: { plate_number?: string; plate_number_full?: string };
  id: number;
  name: string;
  phone: string;
  full_name: string;
  phone_number: string;
  type: "owner" | "relative" | "staff";
  owner_id?: number;
  notes: string;
  national_id?: number;
  created_at?: string;
  updated_at?: string;
  status: "allowed" | "notAllowed";
  phone_numbers: string[];
  face_id?: string | null;
  driving_license?: string | null;
  plate_numbers?: string[];
  car_residents?: Array<{ id: number; plate_number?: string; plate_number_full?: string }>;
};
