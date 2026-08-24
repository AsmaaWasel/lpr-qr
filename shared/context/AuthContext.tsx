"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { adminLogin, residentLogin } from "@/services/auth";

type User = {
  id: number;
  username?: string;
  email?: string;
  role?: string;
};

type LoginResponse = {
  type: "admin" | "resident";
  user: User;
};

type AuthContextType = {
  user: User | null;

  loading: boolean;

  login: (email: string, password: string) => Promise<LoginResponse>;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,

  loading: true,

  login: async () => ({
    type: "admin",
    user: {} as User,
  }),

  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AUTH PROVIDER MOUNTED");

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (email: string, password: string) => {
    let data;
    let type: "admin" | "resident";

    try {
      // Admin login
      data = await adminLogin(email, password);

      type = "admin";
    } catch {
      // Resident login
      data = await residentLogin(email, password);

      type = "resident";
    }

    localStorage.setItem("token", data.access_token);

    localStorage.setItem("role", type);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
    } else {
      // لو resident endpoint مش بيرجع user
      const residentUser = {
        ...data,
        role: "resident",
      };

      localStorage.setItem("user", JSON.stringify(residentUser));

      setUser(residentUser);
    }

    return {
      type,
    };
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("role");

    localStorage.removeItem("resident_user");

    localStorage.removeItem("resident_id");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
