export type Gate = {
  id: number;
  name: string;
  desc: string;
  type: "ENTRY" | "EXIT";
  ip: string;
  active: boolean;
  description: string;
  entries_today: string;
  exits_today: string;
};
export type GateFormData = {
  name: string;
  type: string;
  desc: string;
  ip: string;
};
