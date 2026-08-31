export type UnitType = "VILLA";

export type Unit = {
  id: number;
  name: string;
  type: UnitType;
  description?: string | null;
  parent_id?: number | null;
};

export type UnitFormData = {
  name: string;
  type: UnitType;
  description: string;
  parent_id: number | null;
};
