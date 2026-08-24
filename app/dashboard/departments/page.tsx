"use client";

import { useEffect, useState } from "react";

import { StatRow, SectionCard } from "@/shared/ui/voom";

import DepartmentCRUD from "@/components/ui/DepartmentCRUD";

import { Department } from "@/modules/types/department";
import { getDepartments } from "@/services/departments";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();

        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // =========================
  // STATS
  // =========================

  const totalDepartments = departments.length;

  const activeDepartments = departments.filter(
    (department) =>
      department.is_active === true ||
      department.status?.toLowerCase() === "active",
  ).length;

  const inactiveDepartments = departments.filter(
    (department) =>
      department.is_active === false ||
      department.status?.toLowerCase() === "inactive",
  ).length;

  return (
    <div className="space-y-4">
      {/* =========================
          STATS
      ========================= */}

      <StatRow
        items={[
          {
            label: "Total Departments",
            value: totalDepartments,
          },
          {
            label: "MEMBERS",
            value: 0,
          },
          {
            label: "WITH GATE CONTROL",
            value: 0,
          },
          {
            label: "READ ONLY",
            value: 0,
          },
        ]}
      />

      {/* =========================
          DEPARTMENTS CRUD
      ========================= */}

      <SectionCard>
        <DepartmentCRUD />
      </SectionCard>
    </div>
  );
}
