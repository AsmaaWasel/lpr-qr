export type Gate = {
  id: number;
  name: string;
  desc: string;
  type: "ENTRY" | "EXIT";
  ip: string;
  description: string;
};
export type GateFormData = {
  name: string;
  type: string;
  desc: string;
  ip: string;
};
