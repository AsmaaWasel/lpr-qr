import { Unit, UnitFormData } from "@/modules/types/units";
import api from "./api";

const API = "/units";

// =========================
// GET ALL
// =========================

export const getUnits = async (): Promise<Unit[]> => {
  const res = await api.get<Unit[]>(API);

  console.log(res.data);

  return res.data;
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
  const res = await api.patch<Unit>(`${API}/${id}`, data);

  return res.data;
};

// =========================
// DELETE
// =========================

export const deleteUnit = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);

  return res.data;
};
