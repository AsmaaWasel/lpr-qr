import api from "./api";

export type StartAccessCycleResponse = {
  message: string;
  request_id: string;
  gate_entry_id: number | null;
  requires_qr: boolean;
};

export const startAccessCycle = async (
  cameraId: number,
): Promise<StartAccessCycleResponse> => {
  const response = await api.post(
    `/loop-event/${cameraId}`,
  );

  return response.data;
};