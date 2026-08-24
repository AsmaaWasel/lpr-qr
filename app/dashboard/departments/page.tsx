// /app/dashboard/departments/page.tsx

import DepartmentCRUD from "@/components/ui/DepartmentCRUD";

export default function DepartmentsPage() {
  return (
    <div className="w-full -mx-6 px-6">
      {" "}
      {/* إذا كان الـ Layout فيه px-6 */}
      <DepartmentCRUD />
    </div>
  );
}
