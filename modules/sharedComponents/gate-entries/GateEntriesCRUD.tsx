"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import {
  createGateEntry,
  deleteGateEntry,
  getGateEntries,
  updateGateEntry,
} from "@/services/gate-entry";

import GateEntryForm from "./GateEntryForm";

type GateEntry = {
  id: number;
  gate_id: number;
  plate_number: string;
  status?: string;
  entry_time?: string;
};

type GateEntryFormData = {
  gate_id: number;
  plate_number: string;
  status?: string;
  entry_time?: string;
};

export default function GateEntriesCRUD() {
  const [entries, setEntries] = useState<GateEntry[]>([]);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<GateEntry | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const toast = useToast();

  const selectedEntry = entries.find((e) => e.id === selectedId) || null;

  // ==========================
  // LOAD
  // ==========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGateEntries();

        setEntries(data);
      } catch {
        toast.error("Failed to load gate entries");
      }
    };

    load();
  }, []);

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async (data: GateEntryFormData) => {
    try {
      if (editing) {
        await updateGateEntry(editing.id, data);

        toast.success("Gate entry updated successfully");
      } else {
        await createGateEntry(data);

        toast.success("Gate entry created successfully");
      }

      const refreshed = await getGateEntries();

      setEntries(refreshed);

      setOpen(false);

      setEditing(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gate Entries</h1>

          <p className="text-muted-foreground text-2xl mt-1">Manage gate entries</p>
        </div>
      </div>

      {/* TABLE */}
      <GateEntriesTable
        data={entries}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
      />

      {/* MODAL */}
      {open && (
        <GateEntryForm
          editing={editing}
          onClose={() => {
            setOpen(false);

            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
