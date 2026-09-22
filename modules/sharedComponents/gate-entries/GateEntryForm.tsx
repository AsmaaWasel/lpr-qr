// @ts-nocheck
"use client"

import type { GateEntry } from "@/modules/types/gateEntry";

import { useState } from "react";

type FormData = {
  gate_id: number;
  plate_number: string;
  status: string;
  entry_time: string;
};

type Props = {
  editing: GateEntry | null;

  onClose: () => void;

  onSubmit: (data: FormData) => void;
};

export default function GateEntryForm({ editing, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    gate_id: editing?.gate_id || 0,
    plate_number: editing?.plate_number || "",
    status: editing?.status || "",
    entry_time: editing?.entry_time || "",
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {editing ? "Edit Entry" : "Add Entry"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit(form);
          }}
          className="space-y-4"
        >
          {/* GATE ID */}
          <div>
            <label className="text-sm text-muted-foreground">Gate ID</label>

            <input
              type="number"
              value={form.gate_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  gate_id: Number(e.target.value),
                })
              }
              className="w-full mt-2 bg-black/30 border border-border rounded-xl p-3 text-foreground outline-none"
            />
          </div>

          {/* PLATE NUMBER */}
          <div>
            <label className="text-sm text-muted-foreground">Plate Number</label>

            <input
              value={form.plate_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  plate_number: e.target.value,
                })
              }
              className="w-full mt-2 bg-black/30 border border-border rounded-xl p-3 text-foreground outline-none"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm text-muted-foreground">Status</label>

            <input
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="w-full mt-2 bg-black/30 border border-border rounded-xl p-3 text-foreground outline-none"
            />
          </div>

          {/* ENTRY TIME */}
          <div>
            <label className="text-sm text-muted-foreground">Entry Time</label>

            <input
              type="datetime-local"
              value={form.entry_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  entry_time: e.target.value,
                })
              }
              className="w-full mt-2 bg-black/30 border border-border rounded-xl p-3 text-foreground outline-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary text-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand hover:bg-brand text-foreground"
            >
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
