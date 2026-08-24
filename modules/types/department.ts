// /modules/types/department.ts

export interface Department {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormData {
  name: string;
  description: string;
  is_active?: boolean;
}
