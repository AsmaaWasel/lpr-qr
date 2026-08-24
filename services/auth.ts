import api from "./api";

// =========================
// ADMIN LOGIN
// =========================
export const adminLogin = async (email: string, password: string) => {
  // Login admin
  const loginResponse = await api.post("/auth/login", {
    email,
    password,
  });

  const token = loginResponse.data.access_token;

  // Get users using token
  const usersResponse = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const currentUser = usersResponse.data.find(
    (user: any) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (!currentUser) {
    throw new Error("Admin user not found");
  }

  return {
    access_token: token,
    user: currentUser,
  };
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
