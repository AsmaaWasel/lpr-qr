"use client";

import { useState, useEffect } from "react";
import { getDepartments } from "@/services/departments";

type Department = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
};

type Props = {
  onSubmit: (data: {
    username: string;
    email: string;
    role: string;
    department_id: number;
    password: string;
  }) => void;

  editing?: {
    id: number;
    username: string;
    email: string;
    role: string;
    department_id: number;
    phone?: string; // اختياري
  } | null;

  onClose: () => void;
};

export default function UserForm({ onSubmit, editing, onClose }: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(() => ({
    username: editing?.username ?? "",
    email: editing?.email ?? "",
    role: editing?.role ?? "admin",
    department_id: editing?.department_id ?? 0,
    password: "",
  }));

  // =========================
  // LOAD DEPARTMENTS
  // =========================
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // التحقق من اختيار قسم
    if (form.department_id === 0) {
      alert("Please select a department");
      return;
    }

    onSubmit({
      username: form.username,
      email: form.email,
      role: form.role,
      department_id: form.department_id,
      password: form.password,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-2xl p-6 border border-border">
        <div className="mb-5">
          <h2 className="text-foreground text-xl font-semibold">
            {editing ? "Edit User" : "Add User"}
          </h2>

          <p className="text-muted-foreground text-sm mt-1">
            Manage user information
          </p>
        </div>

        {/* Username */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-muted-foreground">Username *</label>

          <input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter username"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-brand"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-muted-foreground">Email *</label>

          <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="name@example.com"
            type="email"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-brand"
            required
          />
        </div>

        {/* Password - only for new users */}
        {!editing && (
          <div className="space-y-2 mb-4">
            <label className="text-sm text-muted-foreground">Password *</label>

            <input
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              type="password"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-brand"
              required
            />
          </div>
        )}

        {/* Role */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-muted-foreground">Role *</label>

          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full text-lg bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-brand"
          >
            <option value="admin">Admin</option>
            <option value="security">Security</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Department */}
        <div className="space-y-2 mb-5">
          <label className="text-sm text-muted-foreground">Department *</label>

          <select
            value={form.department_id}
            onChange={(e) =>
              handleChange("department_id", Number(e.target.value))
            }
            className="w-full text-lg bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-brand"
            disabled={loading}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id} className="text-foreground">
                {dept.name} {!dept.is_active && "(Inactive)"}
              </option>
            ))}
          </select>

          {/* إظهار اسم القسم المحدد (اختياري) */}
          {form.department_id !== 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected:{" "}
              {departments.find((d) => d.id === form.department_id)?.name ||
                "Unknown"}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-card text-muted-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-brand hover:bg-brand text-foreground transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
