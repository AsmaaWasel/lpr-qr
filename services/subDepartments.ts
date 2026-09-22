import api from "./api";

const API = "/sub-departments";

// =========================
// GET ALL
// =========================

export const getSubDepartments = async () => {
  const res = await api.get(API);

  return res.data.data ?? res.data ?? [];
};

// =========================
// GET ONE
// =========================

export const getSubDepartment = async (id: number) => {
  const res = await api.get(`${API}/${id}`);

  return res.data;
};

// =========================
// CREATE
// =========================

export const createSubDepartment = async (data: {
  name: string;
  description: string;
  department_id: number;
}) => {
  const res = await api.post(API, data);

  return res.data;
};

// =========================
// UPDATE
// =========================

export const updateSubDepartment = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    department_id?: number;
  },
) => {
  const res = await api.patch(`${API}/${id}`, data);

  return res.data;
};

// =========================
// DELETE
// =========================

export const deleteSubDepartment = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);

  return res.data;
};
