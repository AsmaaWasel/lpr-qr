// modules/types/user.ts

type User = {
  id: number;
  email: string;
  role: string;
};
// نوع البيانات المرسلة في الطلبات (POST/PATCH)
export type UserFormData = {
  username: string;
  email: string;
  role: string;
  // ملاحظة: status و is_active قد تكون اختيارية في الإرسال
  // حسب ما يتوقعه الـ API
};
