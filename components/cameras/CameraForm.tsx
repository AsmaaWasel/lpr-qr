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

export default function CameraForm({ editing, onClose, onSubmit }: Props) {
  const [gates, setGates] = useState<Gate[]>([]);

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

  const handleChange = <K extends keyof CameraFormData>(
    key: K,
    value: CameraFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gateId = Number(e.target.value);

    const selectedGate = gates.find((gate) => gate.id === gateId);

    setForm((prev) => ({
      ...prev,
      gate_id: gateId,
      location: selectedGate?.name || "",
    }));
  };

  const handleSave = async () => {
    const selectedGate = gates.find((gate) => gate.id === form.gate_id);

    if (!selectedGate) {
      alert("Please select a gate");
      return;
    }

    await onSubmit({
      ...form,
      gate_id: selectedGate.id,
      location: selectedGate.name,
      port: Number(form.port),
    });
  };

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
              className={inputClassName}
            >
              {gates.map((gate) => (
                <option key={gate.id} value={gate.id}>
                  {gate.name}
                </option>
              ))}
            </select>
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
              className={inputClassName}
            />
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
              className={inputClassName}
            />
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
              className={inputClassName}
            />
          </div>

          {/* Port */}
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Port
            </label>

            <input
              type="number"
              placeholder="Enter port number (e.g., 8080)"
              value={form.port || ""}
              onChange={(e) =>
                handleChange(
                  "port",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              className={inputClassName}
            />
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
              className={inputClassName}
            />
          </div>

          {/* Notes - Full Width */}
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
              `}
            />
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
