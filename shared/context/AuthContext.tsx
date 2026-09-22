"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { DEMO_USER } from "@/data/demo";

// =========================
// TYPES
// =========================

type User = {
  id: number;
  username?: string;
  email?: string;
  role?: "superAdmin" | "admin" | "resident";
};

type LoginResponse = {
  type: "superAdmin" | "admin" | "resident";
  user: User;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
};

// =========================
// GET ROLE FROM JWT
// =========================

const getRoleFromToken = (
  token: string,
): "superAdmin" | "admin" | "resident" => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    console.log("JWT PAYLOAD:", payload);

    if (payload.role === "superAdmin") {
      return "superAdmin";
    }

    if (payload.role === "admin") {
      return "admin";
    }

    return "resident";
  } catch (error) {
    console.error("Failed to decode token:", error);
    return "resident";
  }
};

// =========================
// CONTEXT
// =========================

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,

  login: async () => ({
    type: "resident",
    user: {} as User,
  }),

  logout: () => {},
});

// =========================
// PROVIDER
// =========================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    setUser(DEMO_USER);
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
    localStorage.setItem("role", DEMO_USER.role);
    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (
    _email: string,
    _password: string,
  ): Promise<LoginResponse> => {
    setUser(DEMO_USER);
    return {
      type: DEMO_USER.role,
      user: DEMO_USER,
    };
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
      setUser(DEMO_USER);
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    localStorage.removeItem("resident_user");
    localStorage.removeItem("resident_id");

    setUser(null);
  };

  // =========================
  // PROVIDER
  // =========================

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

// =========================
// HOOK
// =========================

export const useAuth = () => useContext(AuthContext);
