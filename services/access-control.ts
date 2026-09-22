// services/access-control.ts

import api from "./api";

export const openGate = async (gateId: number) => {
  const res = await api.post(`/access-control/open-gate/${gateId}`);

  return res.data;
};

export const closeGate = async (gateId: number) => {
  const res = await api.post(`/access-control/close-gate/${gateId}`);

  return res.data;
};
