export type User = {
  name?: string;
  sub_department_id?: number;
  sub_department?: { name?: string };
  id: number;
  username: string;
  email: string;
  role: string;
  department_id: number;
  phone?: string;
  is_active: number;
};

export type UserFormData = {
  username: string;
  email: string;
  role: string;
  department_id: number;
  phone: string;
};
