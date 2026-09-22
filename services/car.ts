import { Car } from "@/modules/types/car";
import api from "./axios";

// =========================
// GET CARS
// =========================
export const getCars = async (
  page: number = 1,
  limit: number = 100,
): Promise<{ data: Car[] }> => {
  const skip = (page - 1) * limit;

  const res = await api.get("/cars/", {
    params: {
      skip,
      limit,
    },
  });

  return {
    data:
      res.data?.data || res.data?.results || res.data?.items || res.data || [],
  };
};

// =========================
// CREATE CAR
// =========================
export const createCar = async (data: Partial<Car>) => {
  const res = await api.post("/cars/", data);

  return res.data;
};

// =========================
// UPDATE CAR
// =========================
export const updateCar = async (id: number, data: Partial<Car>) => {
  const res = await api.put(`/cars/${id}/`, data);

  return res.data;
};

// =========================
// DELETE CAR
// =========================
export const deleteCar = async (id: number) => {
  await api.delete(`/cars/${id}/`);
};
