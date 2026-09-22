import api from "./api";

export type GateEntryPayload = {
  gate_id: number;
  plate_number: string;
  status?: string;
  entry_time?: string;
};

export async function getGateEntries() {
  const response = await api.get("/gate-entries/");
  return response.data;
}

export async function createGateEntry(data: GateEntryPayload) {
  const response = await api.post("/gate-entries/", data);
  return response.data;
}

export async function updateGateEntry(id: number, data: GateEntryPayload) {
  const response = await api.put(`/gate-entries/${id}`, data);
  return response.data;
}

export async function deleteGateEntry(id: number) {
  return api.delete(`/gate-entries/${id}`);
}
