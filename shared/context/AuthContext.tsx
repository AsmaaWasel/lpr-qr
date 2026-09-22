"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { adminLogin, residentLogin } from "@/services/auth";
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
    if (true) {
      setUser(DEMO_USER);
      localStorage.setItem("user", JSON.stringify(DEMO_USER));
      localStorage.setItem("role", DEMO_USER.role);
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // نقرأ الـ role الحقيقي من الـ JWT
        const role = getRoleFromToken(storedToken);

        const loggedUser: User = {
          ...parsedUser,
          role,
        };

        setUser(loggedUser);

        // نحدث localStorage لو كان فيه role قديم
        localStorage.setItem("user", JSON.stringify(loggedUser));

        localStorage.setItem("role", role);
      } catch (error) {
        console.error("Failed to load user:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    let data;
    let type: "superAdmin" | "admin" | "resident";

    try {
      // =========================
      // ADMIN / SUPER ADMIN LOGIN
      // =========================

      data = await adminLogin(email, password);

      const token = data.access_token;

      // نحدد الـ role من الـ JWT
      type = getRoleFromToken(token);
    } catch (adminError) {
      // =========================
      // RESIDENT LOGIN
      // =========================

      data = await residentLogin(email, password);

      const token = data.access_token;

      type = getRoleFromToken(token);

      // لو resident endpoint بيرجع resident بشكل طبيعي
      if (type !== "resident") {
        type = "resident";
      }
    }

    // =========================
    // SAVE TOKEN
    // =========================

    localStorage.setItem("token", data.access_token);

    // =========================
    // SAVE ROLE
    // =========================

    localStorage.setItem("role", type);

    // =========================
    // CREATE USER
    // =========================

    const loggedUser: User = {
      ...(data.user ?? data),
      role: type,
    };

    // =========================
    // SAVE USER
    // =========================

    localStorage.setItem("user", JSON.stringify(loggedUser));

    setUser(loggedUser);

    console.log("========== LOGIN RESULT ==========");
    console.log("TYPE:", type);
    console.log("USER:", loggedUser);
    console.log("TOKEN ROLE:", getRoleFromToken(data.access_token));
    console.log("===================================");

    return {
      type,
      user: loggedUser,
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
