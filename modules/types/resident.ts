// modules/types/resident.ts
export type Resident = {
  id: number;
  full_name: string;
  phone_number: string;
  type: "owner" | "relative" | "staff";
  owner_id?: number;
  notes: string;
  national_id?: number;
  created_at?: string;
  updated_at?: string;
  status: "allowed" | "notAllowed";
  phone_numbers: string[]; // Added this line to represent multiple phone numbers
};
