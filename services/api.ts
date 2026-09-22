import axios from "axios";
import {
  demoCameras,
  demoDepartments,
  demoGates,
  demoGateEntries,
  demoPlates,
  demoQrCodes,
  demoReaders,
  demoResidents,
  demoUnits,
  demoUsers,
  demoVisitors,
} from "@/data/demo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const api = axios.create({
  baseURL: API_BASE_URL,
});

if (isDemoMode) {
  api.defaults.adapter = async (config) => {
    const url = config.url ?? "";
    const method = (config.method ?? "get").toLowerCase();
    const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;

    let data: unknown = [];
    if (url.includes("gate-entries")) data = demoGateEntries;
    else if (url.includes("visitor-logs") || url.includes("visitors")) data = demoVisitors;
    else if (url.includes("residents")) data = demoResidents;
    else if (url.includes("cameras")) data = demoCameras;
    else if (url.includes("readers")) data = demoReaders;
    else if (url.includes("gates")) data = demoGates;
    else if (url.includes("departments") || url.includes("sub-departments")) data = demoDepartments;
    else if (url.includes("units")) data = demoUnits;
    else if (url.includes("plates") || url.includes("cars")) data = demoPlates;
    else if (url.includes("/qr")) data = demoQrCodes;
    else if (url.includes("users")) data = demoUsers;

    if (method !== "get" && body && typeof body === "object") {
      data = { id: Date.now(), ...body };
    }

    return {
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
}

// Add token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log("REQUEST:", config.method, config.url);
  console.log("HEADERS:", config.headers);

  return config;
});

export default api;
