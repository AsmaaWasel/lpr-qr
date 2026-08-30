"use client";

import { useEffect, useMemo, useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";
import { IdentityVisitor } from "@/modules/types/visitor";
import {
  createIdentityVisitor,
  deleteIdentityVisitor,
  getIdentityVisitors,
  updateIdentityVisitor,
} from "@/services/visitor";

import IdentityVisitorsTable from "./VisitorsTable";
import IdentityVisitorForm from "./VisitorForm";

type FormData = {
  full_name: string;
  id_number: string;
  document_type: string;
  birth_date: string;
  expiry_date: string;
  address: string;
};

const PAGE_SIZE = 8;

export default function IdentityVisitorsCRUD() {
  const [visitors, setVisitors] = useState<IdentityVisitor[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IdentityVisitor | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const selectedVisitor = visitors.find((v) => v.id === selectedId) || null;

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getIdentityVisitors();

        if (Array.isArray(response)) {
          setVisitors(response);
        } else if (Array.isArray(response.data)) {
          setVisitors(response.data);
        } else {
          setVisitors([]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load visitors");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const q = search.toLowerCase();

      return (
        v.full_name?.toLowerCase().includes(q) ||
        v.id_number?.toLowerCase().includes(q)
      );
    });
  }, [visitors, search]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredVisitors.length / PAGE_SIZE);

  const paginatedVisitors = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVisitors.slice(start, start + PAGE_SIZE);
  }, [filteredVisitors, page]);

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateIdentityVisitor(editing.id, data);
        toast.success("Visitor updated successfully");
      } else {
        await createIdentityVisitor(data);
        toast.success("Visitor created successfully");
      }

      const refreshed = await getIdentityVisitors();

      if (Array.isArray(refreshed)) {
        setVisitors(refreshed);
      } else if (Array.isArray(refreshed.data)) {
        setVisitors(refreshed.data);
      }

      setOpen(false);
      setEditing(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async () => {
    if (!selectedVisitor) return;

    try {
      await deleteIdentityVisitor(selectedVisitor.id);
      toast.success("Visitor deleted successfully");

      const refreshed = await getIdentityVisitors();
      setVisitors(Array.isArray(refreshed) ? refreshed : refreshed.data || []);

      setSelectedId(null);
    } catch {
      toast.error("Failed to delete visitor");
    }
  };

  return (
    <div className="space-y-5">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Identity Visitors
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage identity visitors
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 text-lg py-2 rounded-xl bg-card border border-border text-foreground placeholder-slate-500 outline-none"
        />
      </div>

      {/* =========================
          TABLE
      ========================= */}
      {loading ? (
        <div className="text-muted-foreground text-sm">Loading visitors...</div>
      ) : (
        <IdentityVisitorsTable
          data={paginatedVisitors}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />
      )}

      {/* =========================
          PAGINATION
      ========================= */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg bg-card hover:bg-secondary text-lg"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-lg bg-card hover:bg-secondary text-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* =========================
          FORM MODAL
      ========================= */}
      {open && (
        <IdentityVisitorForm
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
