export interface Resident {
  id: number;
  full_name: string;
  phone_number: string;
  national_id: string;
  type: string;
  notes?: string;
  email?: string;
  full_name_ar?: string;
  address?: string;
  birth_date?: string | null;
  gender?: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  front_pic?: string;
  is_blocked?: boolean;
  is_subscribed: boolean;
  created_at?: string;
  updated_at?: string;
  status: "allowed" | "blocked";
}

export type ResidentUser = {
  id: number;
  full_name?: string;
  email?: string;
  building_number?: string;
  flat_number?: string;
};

export interface GetResidentsResponse {
  total: number;
  count: number;
  data: Resident[];
}

export interface CreateResidentData {
  full_name: string;
  phone_number: string;
  national_id: string;
  type: string;
  notes?: string;
}

export interface CredentialsData {
  email: string;
  password: string;
}

export interface IdentityData {
  national_id: string;
  full_name_ar: string;
  address: string;
  birth_date: string | null;
  gender: string;
  issue_date: string | null;
  expiry_date: string | null;
}

export interface UpdateResidentData {
  full_name?: string;
  phone_number?: string;
  national_id?: string;
  type?: string;
  notes?: string;
  email?: string;
  full_name_ar?: string;
  address?: string;
  birth_date?: string | null;
  gender?: string;
  issue_date?: string | null;
  expiry_date?: string | null;
}

export type ResidentFormData = {
  full_name: string;
  phone_number: string;
  national_id: string;
  type: string;
  notes?: string;
};
