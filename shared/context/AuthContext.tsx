"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { adminLogin, residentLogin } from "@/services/auth";
import { User } from "@/modules/types/user";

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,

  login: async () => ({
    type: "admin",
    user: {} as User,
  }),

  logout: () => {},
});

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AUTH PROVIDER MOUNTED");

  /* =========================================================
     INITIAL USER
  ========================================================= */

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error("Failed to load stored user:", error);

      localStorage.removeItem("user");

      return null;
    }
  });

  /*
   * Since the user is loaded during state initialization,
   * there is no need for useEffect.
   *
   * Start with false because initialization is synchronous.
   */
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOGIN
  ========================================================= */

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    let data;
    let type: "admin" | "resident";

    setLoading(true);

    try {
      /* =====================================================
         ADMIN LOGIN
      ===================================================== */

      try {
        data = await adminLogin(email, password);
        type = "admin";
      } catch {
        /* ===================================================
           RESIDENT LOGIN
        =================================================== */

        data = await residentLogin(email, password);
        type = "resident";
      }

      /* =====================================================
         TOKEN
      ===================================================== */

      localStorage.setItem("token", data.access_token);

      /* Use role consistently */
      localStorage.setItem("role", type);

      /* =====================================================
         USER
      ===================================================== */

      let loggedUser: User;

      if (data.user) {
        loggedUser = data.user;
      } else {
        /*
         * Resident endpoint doesn't return user.
         * Build a user object from the response.
         */

        loggedUser = {
          ...data,
          role: "resident",
        } as User;
      }

      /* =====================================================
         STORE USER
      ===================================================== */

      localStorage.setItem("user", JSON.stringify(loggedUser));

      setUser(loggedUser);

      /* =====================================================
         RETURN
      ===================================================== */

      return {
        type,
        user: loggedUser,
      };
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    localStorage.removeItem("resident_user");
    localStorage.removeItem("resident_id");

    setUser(null);
  };

  /* =========================================================
     PROVIDER
  ========================================================= */

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

/* =========================================================
   HOOK
========================================================= */

export const useAuth = () => useContext(AuthContext);
