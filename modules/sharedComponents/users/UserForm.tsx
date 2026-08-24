"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getDepartments } from "@/services/departments";

type Department = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
};

type UserFormData = {
  username: string;
  email: string;
  role: string;
  department_id: number;
  password: string;
};

type Props = {
  editing?: {
    id: number;
    username: string;
    email: string;
    role: string;
    department_id: number;
    phone?: string;
  } | null;

  onClose: () => void;

  onSubmit: (data: UserFormData) => void | Promise<void>;
};

export default function UserForm({ editing, onClose, onSubmit }: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState(editing?.username ?? "");

  const [email, setEmail] = useState(editing?.email ?? "");

  const [role, setRole] = useState(editing?.role ?? "admin");

  const [departmentId, setDepartmentId] = useState(editing?.department_id ?? 0);

  const [password, setPassword] = useState("");

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

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email");
      return;
    }

    if (departmentId === 0) {
      alert("Please select a department");
      return;
    }

    if (!editing && !password.trim()) {
      alert("Please enter password");
      return;
    }

    await onSubmit({
      username: username.trim(),
      email: email.trim(),
      role,
      department_id: departmentId,
      password,
    });
  };

  // =========================
  // INPUT STYLE
  // =========================

  const inputClassName = `
    w-full
    h-12
    rounded-xl
    border
    border-border
    bg-background
    px-4
    text-base
    font-medium
    text-foreground
    outline-none
    transition
    placeholder:text-muted-foreground
    focus:outline-none
    focus:ring-2
    focus:ring-[#132f49]/10
    focus:border-[#132f49]
    dark:focus:ring-white/10
    dark:focus:border-white/30
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full
          max-w-[560px]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit User" : "Add User"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing ? "Update user information" : "Add a new system user"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-muted
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <div className="space-y-4">
          {/* Username */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className={inputClassName}
            />
          </div>

          {/* Email */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className={inputClassName}
            />
          </div>

          {/* Password */}

          {!editing && (
            <div className="space-y-1.5">
              <label className="block text-base font-semibold text-foreground">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className={inputClassName}
              />
            </div>
          )}

          {/* Role */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClassName}
            >
              <option value="admin">Admin</option>

              <option value="security">Security</option>

              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Department */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Department
            </label>

            <select
              value={departmentId || ""}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              disabled={loading}
              className={inputClassName}
            >
              <option value="">
                {loading ? "Loading departments..." : "Select Department"}
              </option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                  {!department.is_active && " (Inactive)"}
                </option>
              ))}
            </select>

            {departmentId !== 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Selected:{" "}
                {departments.find(
                  (department) => department.id === departmentId,
                )?.name || "Unknown"}
              </p>
            )}
          </div>
        </div>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              px-5
              py-2.5
              text-base
              font-semibold
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              rounded-xl
              bg-[#132f49]
              px-6
              py-2.5
              text-base
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
            "
          >
            {editing ? "Update User" : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
}
