// @ts-nocheck
"use client"
// @ts-nocheck

import { useEffect, useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";
import { User, UserFormData } from "@/modules/types/user";
import { createUser, deleteUser, getUsers, updateUser } from "@/services/user";
import UserTable from "./UserTable";
import { CrudShell } from "@/shared/ui/voom";
import UserForm from "./UserForm";

type UserFormData = {
  name: string;
  email: string;
  role: string;
  phone: string;
};

export default function UserCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // UI STATES
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const toast = useToast();

  const selectedUser = users.find((u) => u.id === selectedId) || null;

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        toast.error("Failed to load users");
      }
    };

    load();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.role?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // STATS
  // =========================
  const total = users.length;

  const adminUsers = users.filter(
    (user) => user.role?.toLowerCase() === "admin",
  ).length;

  const securityUsers = users.filter(
    (user) => user.role?.toLowerCase() === "security",
  ).length;

  const managerUsers = users.filter(
    (user) => user.role?.toLowerCase() === "manager",
  ).length;

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editing) {
        await updateUser(editing.id, data);
        toast.success("User updated successfully");
      } else {
        await createUser(data);
        toast.success("User created successfully");
      }

      const refreshed = await getUsers();
      setUsers(refreshed);

      setOpen(false);
      setEditing(null);
      setSelectedId(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);

      toast.success("User deleted successfully");

      const refreshed = await getUsers();
      setUsers(refreshed);

      setSelectedId(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <CrudShell
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search by name, email, role or phone..."
        addLabel="Add User"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={() => {
          if (!selectedUser) return;
          setEditing(selectedUser);
          setOpen(true);
        }}
        onDelete={handleDelete}
        hasSelected={!!selectedUser}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemLabel="users"
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
      >
        <UserTable
          data={paginatedUsers}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />
      </CrudShell>

      {open && (
        <UserForm
          editing={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
