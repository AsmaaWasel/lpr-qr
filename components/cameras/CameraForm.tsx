"use client";

import { CameraFormData } from "@/modules/types/camera";
import { getGates } from "@/services/gate";
import { useEffect, useState } from "react";

type Gate = {
  id: number;
  name: string;
};

type Props = {
  editing?: Partial<CameraFormData> | null;
  onClose: () => void;
  onSubmit: (data: CameraFormData) => void | Promise<void>;
};

type FormErrors = {
  gate_id?: string;
  username?: string;
  password?: string;
  ip_address?: string;
  port?: string;
  add_string_to_url?: string;
  notes?: string;
};

export default function CameraForm({ editing, onClose, onSubmit }: Props) {
  const [gates, setGates] = useState<Gate[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<CameraFormData>({
    gate_id: editing?.gate_id ?? 0,
    location: editing?.location ?? "",
    username: editing?.username ?? "",
    password: editing?.password ?? "",
    ip_address: editing?.ip_address ?? "",
    port: editing?.port != null ? Number(editing.port) : 0,
    notes: editing?.notes ?? "",
    reader_type: editing?.reader_type ?? "CAMERA",
    add_string_to_url: editing?.add_string_to_url ?? "",
  });

  /* ================= FETCH GATES ================= */

  useEffect(() => {
    const fetchGates = async () => {
      try {
        const data = await getGates();
        setGates(data);
      } catch (error) {
        console.error("Failed to fetch gates", error);
      }
    };

    fetchGates();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = <K extends keyof CameraFormData>(
    key: K,
    value: CameraFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Remove error for the field being edited
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  /* ================= GATE CHANGE ================= */

  const handleGateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gateId = Number(e.target.value);
    const selectedGate = gates.find((gate) => gate.id === gateId);

    setForm((prev) => ({
      ...prev,
      gate_id: gateId,
      location: selectedGate?.name || "",
    }));

    if (errors.gate_id) {
      setErrors((prev) => ({
        ...prev,
        gate_id: undefined,
      }));
    }
  };

  /* ================= VALIDATION ================= */

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Gate
    if (!form.gate_id) {
      newErrors.gate_id = "Please select a gate";
    }

    // Username
    if (!form.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (form.username.trim().length > 100) {
      newErrors.username = "Username must not exceed 100 characters";
    }

    // Password
    // Required in both Add and Edit
    if (!form.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    } else if (form.password.length > 100) {
      newErrors.password = "Password must not exceed 100 characters";
    }

    // IP Address
    const ip = form.ip_address?.trim();

    if (!ip) {
      newErrors.ip_address = "IP address is required";
    } else {
      const ipRegex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

      if (!ipRegex.test(ip)) {
        newErrors.ip_address = "Please enter a valid IP address";
      }
    }

    // Port
    const port = Number(form.port);

    if (!form.port || port < 1 || port > 65535) {
      newErrors.port = "Port must be between 1 and 65535";
    }

    // Add SubURL
    const subUrl = form.add_string_to_url?.trim();

    if (subUrl && !subUrl.startsWith("/")) {
      newErrors.add_string_to_url = "SubURL should start with /";
    }

    // Notes
    if (form.notes && form.notes.length > 500) {
      newErrors.notes = "Notes must not exceed 500 characters";
    }

    return newErrors;
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const selectedGate = gates.find((gate) => gate.id === form.gate_id);

    if (!selectedGate) {
      setErrors({
        gate_id: "Please select a valid gate",
      });
      return;
    }

    await onSubmit({
      ...form,
      gate_id: selectedGate.id,
      location: selectedGate.name,
      username: form.username.trim(),
      ip_address: form.ip_address.trim(),
      port: Number(form.port),
      add_string_to_url: form.add_string_to_url?.trim() || "",
      notes: form.notes?.trim() || "",
    });
  };

  /* ================= INPUT STYLE ================= */

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
    focus:ring-2
    focus:ring-[#132f49]/10
    focus:border-[#132f49]
    dark:focus:ring-white/10
    dark:focus:border-white/30
  `;

  const errorClassName = "mt-1 text-sm font-medium text-red-500";

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
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit Camera" : "Add Camera"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update camera connection details"
                : "Add a new camera and configure its connection"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-muted
              text-lg
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Gate */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Gate
            </label>

            <select
              value={form.gate_id || ""}
              onChange={handleGateChange}
              className={`${inputClassName} ${
                errors.gate_id ? "border-red-500 focus:border-red-500" : ""
              }`}
            >
              <option value="">Select gate</option>

              {gates.map((gate) => (
                <option key={gate.id} value={gate.id}>
                  {gate.name}
                </option>
              ))}
            </select>

            {errors.gate_id && (
              <p className={errorClassName}>{errors.gate_id}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={form.username ?? ""}
              onChange={(e) => handleChange("username", e.target.value)}
              className={`${inputClassName} ${
                errors.username ? "border-red-500 focus:border-red-500" : ""
              }`}
            />

            {errors.username && (
              <p className={errorClassName}>{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={form.password ?? ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`${inputClassName} ${
                errors.password ? "border-red-500 focus:border-red-500" : ""
              }`}
            />

            {errors.password && (
              <p className={errorClassName}>{errors.password}</p>
            )}
          </div>

          {/* IP Address */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              IP Address
            </label>

            <input
              type="text"
              placeholder="Enter IP address (e.g., 192.168.1.100)"
              value={form.ip_address ?? ""}
              onChange={(e) => handleChange("ip_address", e.target.value)}
              className={`${inputClassName} ${
                errors.ip_address ? "border-red-500 focus:border-red-500" : ""
              }`}
            />

            {errors.ip_address && (
              <p className={errorClassName}>{errors.ip_address}</p>
            )}
          </div>

          {/* Port */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Port
            </label>

            <input
              type="number"
              min={1}
              max={65535}
              placeholder="Enter port number (e.g., 8080)"
              value={form.port || ""}
              onChange={(e) =>
                handleChange(
                  "port",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              className={`${inputClassName} ${
                errors.port ? "border-red-500 focus:border-red-500" : ""
              }`}
            />

            {errors.port && <p className={errorClassName}>{errors.port}</p>}
          </div>

          {/* Add SubURL */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Add SubURL
            </label>

            <input
              type="text"
              placeholder="Enter string to append to URL (e.g., /stream)"
              value={form.add_string_to_url ?? ""}
              onChange={(e) =>
                handleChange("add_string_to_url", e.target.value)
              }
              className={`${inputClassName} ${
                errors.add_string_to_url
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />

            {errors.add_string_to_url && (
              <p className={errorClassName}>{errors.add_string_to_url}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-base font-semibold text-foreground">
              Notes
            </label>

            <textarea
              placeholder="Enter notes"
              value={form.notes ?? ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              className={`
                ${inputClassName}
                h-auto
                resize-none
                py-3
                ${errors.notes ? "border-red-500 focus:border-red-500" : ""}
              `}
            />

            {errors.notes && <p className={errorClassName}>{errors.notes}</p>}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              px-6
              py-3
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
              px-7
              py-3
              text-base
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
            "
          >
            {editing ? "Update Camera" : "Save Camera"}
          </button>
        </div>
      </div>
    </div>
  );
}
