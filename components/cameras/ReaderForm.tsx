"use client";

import { ReaderFormData } from "@/modules/types/camera";
import { getGates } from "@/services/gate";
import { useEffect, useState } from "react";

type Gate = {
  id: number;
  name: string;
};

type Props = {
  editing?: Partial<ReaderFormData> | null;
  onClose: () => void;
  onSubmit: (data: ReaderFormData) => void;
};

export default function ReaderForm({ editing, onClose, onSubmit }: Props) {
  const [gates, setGates] = useState<Gate[]>([]);

  const [form, setForm] = useState<ReaderFormData>({
    gate_id: editing?.gate_id ?? 0,
    location: editing?.location ?? "",
    username: editing?.username ?? "",
    password: editing?.password ?? "",
    ip_address: editing?.ip_address ?? "",
    port: editing?.port ?? "",
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

  const handleChange = <K extends keyof ReaderFormData>(
    key: K,
    value: ReaderFormData[K],
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

  const isCamera = form.reader_type === "CAMERA";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-card p-5 rounded-xl w-[450px] space-y-3">
        <h2 className="text-foreground font-bold">
          {editing ? "Edit Reader" : "Add Reader"}
        </h2>

        {/* Gate Dropdown */}
        <select
          className="w-full p-2 rounded bg-black/30 text-foreground"
          value={form.gate_id}
          onChange={handleGateChange}
        >
          <option value="" className="text-black">
            Select Gate
          </option>

          {gates.map((gate) => (
            <option key={gate.id} value={gate.id} className="text-black">
              {gate.name}
            </option>
          ))}
        </select>

        {/* Reader Type */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Reader Type</label>

          <select
            className="w-full p-2 rounded bg-black/30 text-foreground"
            value={form.reader_type}
            onChange={(e) => handleChange("reader_type", e.target.value)}
          >
            <option value="" className="text-black">
              Select reader type
            </option>

            <option value="CAMERA" className="text-black">
              Camera
            </option>

            <option value="QRREADER" className="text-black">
              QR Reader
            </option>
          </select>
        </div>

        {isCamera && (
          <>
            <input
              placeholder="Username"
              className="w-full p-2 rounded bg-black/30 text-foreground"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              className="w-full p-2 rounded bg-black/30 text-foreground"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </>
        )}

        <input
          placeholder="IP Address"
          className="w-full p-2 rounded bg-black/30 text-foreground"
          value={form.ip_address}
          onChange={(e) => handleChange("ip_address", e.target.value)}
        />

        <input
          placeholder="Enter port number (e.g., 8080)"
          type="number"
          className="w-full p-2 rounded bg-black/30 text-foreground placeholder:text-muted-foreground"
          value={form.port}
          onChange={(e) => handleChange("port", e.target.value)}
        />

        {/* Add SubURL */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Add SubURL</label>

          <input
            placeholder="Enter string to append to URL (e.g., /stream)"
            className="w-full p-2 rounded bg-black/30 text-foreground placeholder:text-muted-foreground"
            value={form.add_string_to_url}
            onChange={(e) => handleChange("add_string_to_url", e.target.value)}
          />
        </div>

        <input
          placeholder="Notes"
          className="w-full p-2 rounded bg-black/30 text-foreground"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-400">
            Cancel
          </button>

          <button
            onClick={() => {
              const selectedGate = gates.find(
                (gate) => gate.name === form.location,
              );

              if (!selectedGate) {
                alert("Gate not found");
                return;
              }

              onSubmit({
                ...form,
                gate_id: selectedGate.id,
              });
            }}
            className="bg-brand px-3 py-1 rounded text-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
