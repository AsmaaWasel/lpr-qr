import api from "./api";

export async function updateResidentCredentials(
  residentId: number,
  data: { email: string; password?: string },
) {
  const response = await api.patch(`/residents/${residentId}/credentials`, data);
  return response.data;
}

export async function generateResidentQr(residentId: number): Promise<Blob> {
  const response = await api.get(`/residents/${residentId}/qr`, { responseType: "blob" });
  return response.data;
}
