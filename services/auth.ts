import api from "./api";

// =========================
// ADMIN LOGIN
// =========================

// =========================
// ADMIN LOGIN
// =========================

export const adminLogin = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const adminRegister = async (username: string, email: string, password: string) => {
  const response = await api.post("/auth/register", { username, email, password });
  return response.data;
};

// =========================
// RESIDENT LOGIN
// =========================
export const residentLogin = async (email: string, password: string) => {
  const response = await api.post("/residents/login", {
    email,
    password,
  });

  return response.data;
};
