"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { ReaderFormData } from "@/modules/types/camera";
import { getGates } from "@/services/gate";

type Gate = {
  id: number;
  name: string;
};

type Props = {
  editing?: Partial<ReaderFormData> | null;
  onClose: () => void;
  onSubmit: (data: ReaderFormData) => void | Promise<void>;
};

export default function ReaderForm({ editing, onClose, onSubmit }: Props) {
  const [gates, setGates] = useState<Gate[]>([]);

  const [form, setForm] = useState<ReaderFormData>({
    gate_id: editing?.gate_id ?? 0,
    location: editing?.location ?? "",
    username: editing?.username ?? "",
    password: editing?.password ?? "",
    ip_address: editing?.ip_address ?? "",
    port: Number(editing?.port ?? 0),
    notes: editing?.notes ?? "",
    reader_type: editing?.reader_type ?? "",
    add_string_to_url: editing?.add_string_to_url ?? "",
  });

  // =========================
  // GET GATES
  // =========================

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

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = <K extends keyof ReaderFormData>(
    key: K,
    value: ReaderFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // GATE CHANGE
  // =========================

  const handleGateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gateId = Number(e.target.value);

    const selectedGate = gates.find((gate) => gate.id === gateId);

    setForm((prev) => ({
      ...prev,
      gate_id: gateId,
      location: selectedGate?.name || "",
    }));
  };

  // =========================
  // READER TYPE
  // =========================

  const isCamera = form.reader_type === "CAMERA";

  // =========================
  // INPUT CLASS
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

  // =========================
  // SAVE
  // =========================

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
              {editing ? "Edit Reader" : "Add Reader"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update reader information"
                : "Add a new camera or QR reader"}
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
          {/* =========================
              GATE
          ========================= */}

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

          {/* =========================
              READER TYPE
          ========================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Reader Type
            </label>

            <select
              value={form.reader_type}
              onChange={(e) => handleChange("reader_type", e.target.value)}
              className={inputClassName}
            >
              <option value="CAMERA">Camera</option>

              <option value="QRREADER">QR Reader</option>
            </select>
          </div>

          {/* =========================
              CAMERA CREDENTIALS
          ========================= */}

          {isCamera && (
            <>
              {/* Username */}

              <div className="space-y-1.5">
                <label className="block text-base font-semibold text-foreground">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter camera username"
                  value={form.username}
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
                  placeholder="Enter camera password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </>
          )}

          {/* =========================
              IP ADDRESS
          ========================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              IP Address
            </label>

            <input
              type="text"
              value={form.ip_address}
              onChange={(e) => handleChange("ip_address", e.target.value)}
              placeholder="Enter IP address (e.g., 10.20.1.11)"
              className={inputClassName}
            />
          </div>

          {/* =========================
              PORT
          ========================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Port
            </label>

            <input
              type="number"
              value={form.port || ""}
              onChange={(e) => handleChange("port", Number(e.target.value))}
              placeholder="Enter port number (e.g., 8080)"
              className={inputClassName}
            />
          </div>

          {/* =========================
              ADD SUB URL
          ========================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Add SubURL
            </label>

            <input
              type="text"
              value={form.add_string_to_url}
              onChange={(e) =>
                handleChange("add_string_to_url", e.target.value)
              }
              placeholder="Enter string to append to URL (e.g., /stream)"
              className={inputClassName}
            />
          </div>

          {/* =========================
              NOTES
          ========================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add notes about this reader"
              rows={3}
              className={`
                ${inputClassName}
                h-auto
                resize-none
                py-3
              `}
            />
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
            {editing ? "Update Reader" : "Save Reader"}
          </button>
        </div>
      </div>
    </div>
  );
}
