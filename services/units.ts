import { Unit, UnitFormData } from "@/modules/types/units";

import api from "./api";

const API = "/units";

// =========================
// GET ALL
// =========================

export const getUnits = async (): Promise<Unit[]> => {
  const res = await api.get(API);

  console.log("Units API Response:", res.data);

  // API returns array
  if (Array.isArray(res.data)) {
    return res.data;
  }

  // API returns { data: [] }
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }

  // API returns { items: [] }
  if (res.data && Array.isArray(res.data.items)) {
    return res.data.items;
  }

  // API returns { results: [] }
  if (res.data && Array.isArray(res.data.results)) {
    return res.data.results;
  }

  console.warn("Unexpected units response format:", res.data);

  return [];
};

// =========================
// CREATE
// =========================

export const createUnit = async (data: UnitFormData): Promise<Unit> => {
  const res = await api.post<Unit>(API, data);

  return res.data;
};

// =========================
// UPDATE
// =========================

export const updateUnit = async (
  id: number,
  data: UnitFormData,
): Promise<Unit> => {
  const res = await api.put<Unit>(`${API}/${id}`, data);

  return res.data;
};

// =========================
// DELETE
// =========================

export const deleteUnit = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);

  return res.data;
};
