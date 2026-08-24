// services/user.ts

import api from "./api";

const API = "/users";

// =========================
// GET ALL
// =========================
export const getUsers = async () => {
  const res = await api.get(API);
  console.log(res.data);
  return res.data;
};

// =========================
// CREATE
// =========================
export const createUser = async (data: {
  name: string;
  email: string;
  role: string;
  phone: string;
}) => {
  const res = await api.post(API, data);
  return res.data;
};

// =========================
// UPDATE
// =========================
export const updateUser = async (
  id: number,
  data: {
    name: string;
    email: string;
    role: string;
    phone: string;
  },
) => {
  const res = await api.patch(`${API}/${id}`, data);
  return res.data;
};

// =========================
// DELETE
// =========================
export const deleteUser = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);
  return res.data;
};
