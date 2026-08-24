import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const API = `${API_BASE}/plate_numbers`;

// GET ALL
export const getPlates = async () => {
  const res = await axios.get(API);
  return res.data;
};

// CREATE
export const createPlate = async (data: { plate_number_full: string }) => {
  const res = await axios.post(API, data);
  return res.data;
};

// UPDATE
export const updatePlate = async (
  id: number,
  data: { plate_number_full: string },
) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

// DELETE
export const deletePlate = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
