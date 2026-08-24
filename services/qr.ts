// services/qrService.ts
import api from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API = `${API_BASE}`;

// GENERATE QR
export const generateQR = async (data: { max_uses: number }) => {
  const res = await api.post(`${API}/qr/admin/generate`, data);
  return res.data;
};

// GET ALL QR CODES
export const getQRs = async () => {
  const res = await api.get(`${API}/qr`);
  return res.data;
};

// GET QR BY ID
export const getQRById = async (id: number) => {
  const res = await api.get(`${API}/qr/admin/${id}`);
  return res.data;
};

// DELETE QR
export const deleteQR = async (id: number) => {
  const res = await api.delete(`${API}/qr/admin/${id}`);
  return res.data;
};

// UPDATE QR STATUS
export const updateQRStatus = async (
  id: number,
  data: { is_active: boolean },
) => {
  const res = await api.patch(`${API}/qr/admin/${id}/status`, data);
  return res.data;
};
