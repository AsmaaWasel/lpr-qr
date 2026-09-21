export type UnitType = "VILLA" | "BUILDING" | "APARTMENT";

export type Unit = {
  id: number;
  name: string;
  type: UnitType;
  description?: string | null;
  parent_id?: number | null;
  status?: string;
};

export type UnitFormData = {
  name: string;
  type: UnitType;
  description: string;
  parent_id: number | null;
};
