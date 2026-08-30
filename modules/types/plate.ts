export type PlateResident = {
  id: number;
  full_name: string;
  phone_number?: string;
  type?: string;
  national_id?: number;
};

export type Plate = {
  id: number;
  plate_number_full: string;
  plate_country: string;
  resident_id: number | null;
  resident: PlateResident | null;
  is_inside: boolean;
  created_at: string;
  last_entry_at: string | null;
  last_exit_at: string | null;
};
