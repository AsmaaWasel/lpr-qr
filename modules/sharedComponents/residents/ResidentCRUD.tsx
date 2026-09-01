"use client";

import { useEffect, useState } from "react";

import ResidentTable from "./ResidentTable";
import ResidentForm from "./ResidentForm";

import { useToast } from "@/shared/hooks/use-toast";
import { Resident } from "@/modules/types/resident";

import {
  createResident,
  deleteResident,
  getResidents,
  updateResident,
  addCredentials,
} from "@/services/resident";

import { CrudShell } from "@/shared/ui/voom";
import CredentialsForm from "./CredentialsForm";

type ResidentFormData = {
  full_name: string;
  phone_numbers: string[];
  phone_number: string;
  type: string;
  owner_id?: number;
  notes: string;
  national_id?: number;
};

type CredentialsFormData = {
  email: string;
  password: string;
};

export default function ResidentCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [residents, setResidents] = useState<Resident[]>([]);
  const [open, setOpen] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [editing, setEditing] = useState<Resident | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // UI STATES
  // =========================

  const [loading, setLoading] = useState(true);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const toast = useToast();

  const selectedResident =
    residents.find((resident) => resident.id === selectedId) || null;

  // =========================
  // LOAD RESIDENTS
  // =========================

  const loadResidents = async () => {
    try {
      setLoading(true);

      const data = await getResidents(0, 100);

      setResidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed loading residents:", error);
      toast.error("Failed to load residents");
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredResidents = residents.filter((resident) => {
    if (!resident) return false;

    const query = search.toLowerCase();

    return (
      resident.full_name?.toLowerCase().includes(query) ||
      resident.phone_number?.includes(search) ||
      resident.national_id?.toString().includes(search) ||
      resident.type?.toLowerCase().includes(query) ||
      resident.status?.toLowerCase().includes(query) ||
      resident.notes?.toLowerCase().includes(query)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredResidents.length / pageSize) || 1;

  const paginatedResidents = filteredResidents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (data: ResidentFormData) => {
    try {
      if (editing) {
        await updateResident(editing.id, data);
        toast.success("Resident updated successfully");
      } else {
        await createResident(data);
        toast.success("Resident created successfully");
      }

      await loadResidents();

      setOpen(false);
      setEditing(null);
      setSelectedId(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!selectedResident) return;

    try {
      await deleteResident(selectedResident.id);

      toast.success("Resident deleted successfully");

      await loadResidents();

      setSelectedId(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resident");
    }
  };

  // =========================
  // CREDENTIALS
  // =========================

  const handleCredentialsSubmit = async (data: CredentialsFormData) => {
    if (!selectedResident) return;

    try {
      setCredentialsLoading(true);

      await addCredentials(selectedResident.id, {
        email: data.email,
        password: data.password,
      });

      toast.success("Credentials added successfully");
      setOpenCredentials(false);
    } catch (error) {
      console.error("Credentials error:", error);
      toast.error("Failed to add credentials");
    } finally {
      setCredentialsLoading(false);
    }
  };
  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = (
    residentId: number,
    newStatus: Resident["status"],
  ) => {
    setResidents((prevResidents) =>
      prevResidents.map((resident) =>
        resident.id === residentId
          ? {
              ...resident,
              status: newStatus,
            }
          : resident,
      ),
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <>
      <div className="space-y-4">
        {/* =========================
            RESIDENT CRUD CARD
        ========================= */}

        <CrudShell
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by name, phone, national ID or notes..."
          addLabel="Add Resident"
          onAdd={() => {
            setEditing(null);
            setOpen(true);
          }}
          onEdit={() => {
            if (!selectedResident) return;

            setEditing(selectedResident);
            setOpen(true);
          }}
          onDelete={handleDelete}
          hasSelected={!!selectedResident}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredResidents.length}
          itemLabel="residents"
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(totalPages || 1, page + 1))
          }
          extraActions={
            <button
              type="button"
              disabled={!selectedResident}
              onClick={() => {
                if (selectedResident) {
                  setOpenCredentials(true);
                }
              }}
              className="
        voom-btn
        bg-[#6e757f]
        text-[##132f49]
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
            >
              Add Credentials
            </button>
          }
        >
          <ResidentTable
            data={paginatedResidents}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
            onStatusChange={handleStatusChange}
          />
        </CrudShell>
      </div>

      {/* =========================
          RESIDENT FORM
      ========================= */}

      {open && (
        <ResidentForm
          editing={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* =========================
          CREDENTIALS FORM
      ========================= */}

      {openCredentials && selectedResident && (
        <CredentialsForm
          residentId={selectedResident.id}
          residentName={selectedResident.full_name}
          onClose={() => setOpenCredentials(false)}
          onSubmit={handleCredentialsSubmit}
          loading={credentialsLoading}
        />
      )}
    </>
  );
}
