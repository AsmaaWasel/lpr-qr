"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, residentLogin } from "@/services/auth";
import { useAuth } from "@/shared/context/AuthContext";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gateStatus, setGateStatus] = useState<"idle" | "opening" | "error">(
    "idle",
  );

  const handleLogin = async (
    role: string,
    username: string,
    password: string,
  ) => {
    setError("");
    setLoading(true);

    try {
      if (role === "admin") {
        const data = await adminLogin(username, password);

        localStorage.setItem("token", data.access_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        await login(username, password);
      } else {
        const data = await residentLogin(username, password);

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("resident_id", String(data.user.id));
      }

      setGateStatus("opening");

      await new Promise((r) => setTimeout(r, 1200));

      router.push(role === "admin" ? "/dashboard" : "/owner");
    } catch (err: any) {
      setGateStatus("error");
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
    setError,
    gateStatus,
  };
}
