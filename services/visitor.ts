import axios from "axios";

// أضف قيمة افتراضية لمنع الـ undefined
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API = `${API_BASE_URL}/identity-visitors`;

export const getIdentityVisitors = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getIdentityVisitorById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);

  return res.data;
};

export const createIdentityVisitor = async (data: unknown) => {
  const res = await axios.post(API, data);

  return res.data;
};

export const updateIdentityVisitor = async (id: number, data: unknown) => {
  const res = await axios.put(`${API}/${id}`, data);

  return res.data;
};

export const deleteIdentityVisitor = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);

  return res.data;
};
