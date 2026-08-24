// services/resident.ts
import api from "./api";

const API = "/residents";

// =========================
// GET ALL
// =========================
export const getResidents = async (skip: number = 0, limit: number = 10) => {
  const res = await api.get(`${API}?skip=${skip}&limit=${limit}`);
  console.log("API Response:", res.data);

  if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
    if (res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (res.data.items && Array.isArray(res.data.items)) {
      return res.data.items;
    }
    if (res.data.results && Array.isArray(res.data.results)) {
      return res.data.results;
    }
    if (Object.values(res.data).every((val) => typeof val === "object")) {
      return Object.values(res.data);
    }
    return [];
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }

  console.warn("Unexpected response format:", res.data);
  return [];
};

// =========================
// CREATE
// =========================
export const createResident = async (data: {
  full_name: string;
  phone_number: string;
  type: string;

  owner_id?: number;
  notes: string;
  national_id?: number;
}) => {
  // The interceptor will add the token automatically
  // No need to manually set Authorization header
  const res = await api.post(API, data);
  return res.data;
};

// =========================
// UPDATE
// =========================
export const updateResident = async (
  id: number,
  data: {
    full_name: string;
    phone_number: string;
    type: string;

    owner_id?: number;
    notes: string;
    national_id?: number;
  },
) => {
  const res = await api.put(`${API}/${id}`, data);
  return res.data;
};

// =========================
// DELETE
// =========================
export const deleteResident = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);
  return res.data;
};
// =========================
// ADD CREDENTIALS - ✅ متأكد إنه مضبوط
// =========================
export const addCredentials = async (
  residentId: number,
  data: {
    email: string;
    password: string;
  },
) => {
  const res = await api.patch(`${API}/${residentId}/credentials`, data);
  return res.data;
};
// =========================
// TOGGLE RESIDENT STATUS (allowed / notAllowed)
// =========================
export const toggleResidentStatus = async (id: number, status: boolean) => {
  // status: true = allowed, false = notAllowed
  const res = await api.patch(`${API}/${id}/subscribe/${status}`);
  return res.data;
};
