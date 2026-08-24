import api from "./api";

const API = "/cameras";

// =========================
// GET ALL
// =========================
export const getCameras = async () => {
  const res = await api.get(API);

  return res.data.data ?? res.data ?? [];
};

// =========================
// GET ONE
// =========================
export const getCamera = async (id: number) => {
  const res = await api.get(`${API}/${id}`);

  return res.data;
};

// =========================
// CREATE
// =========================
export const createCamera = async (data: {
  location: string;
  username: string;
  password: string;
  ip_address: string;
  port: number;
  gate_id: number;
  notes?: string;
}) => {
  const res = await api.post(API, data);

  return res.data;
};

// =========================
// UPDATE
// =========================
export const updateCamera = async (
  id: number,
  data: {
    location?: string;
    username?: string;
    password?: string;
    ip_address?: string;
    port?: number;
    gate_id?: number;
    notes?: string;
  },
) => {
  const res = await api.patch(`${API}/${id}`, data);

  return res.data;
};

// =========================
// DELETE
// =========================
export const deleteCamera = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);

  return res.data;
};
