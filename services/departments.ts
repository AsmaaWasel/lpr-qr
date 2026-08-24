// /services/departments.ts

import api from "./api";

const API = "/departments";

// =========================
// GET ALL
// =========================
export const getDepartments = async () => {
  const res = await api.get(API);
  return res.data.data ?? res.data ?? [];
};

// =========================
// GET ONE
// =========================
export const getDepartment = async (id: number) => {
  const res = await api.get(`${API}/${id}`);
  return res.data;
};

// =========================
// CREATE
// =========================
export const createDepartment = async (data: {
  name: string;
  description: string;
  is_active?: boolean;
}) => {
  const res = await api.post(API, data);
  return res.data;
};

// =========================
// UPDATE
// =========================
export const updateDepartment = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    is_active?: boolean;
  },
) => {
  const res = await api.patch(`${API}/${id}`, data);
  return res.data;
};

// =========================
// DELETE
// =========================
export const deleteDepartment = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);
  return res.data;
};
