import { GateEntry } from "@/modules/types/gateEntry";
import api from "./api";

const API = "/gates";

// =========================
// GET ALL
// =========================
export const getGates = async () => {
  const res = await api.get(API);
  console.log(res.data);
  return res.data;
};

// =========================
// CREATE
// =========================
export const createGate = async (data: {
  name: string;
  desc: string;
  ip: string;
}) => {
  const res = await api.post(API, data);
  return res.data;
};

// =========================
// UPDATE
// =========================
export const updateGate = async (
  id: number,
  data: {
    name: string;
    desc: string;
    ip: string;
  },
) => {
  const res = await api.patch(`${API}/${id}`, data);
  return res.data;
};

// =========================
// DELETE
// =========================
export const deleteGate = async (id: number) => {
  const res = await api.delete(`${API}/${id}`);
  return res.data;
};
// =========================
// GET ALL GATE ENTRIES
// =========================
export const getGateEntry = async (): Promise<GateEntry> => {
  const res = await api.get<GateEntry>(`/gate-entries`);
  console.log(res.data);
  return res.data;
};
