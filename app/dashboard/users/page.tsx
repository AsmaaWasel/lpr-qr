"use client";

import { useEffect, useState } from "react";

import { PillTabs, StatRow, SectionCard, LPR_TABS } from "@/shared/ui/voom";

import UserCRUD from "@/modules/sharedComponents/users/UserCRUD";

import { User } from "@/modules/types/user";
import { getUsers } from "@/services/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USERS
  // =========================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // =========================
  // STATS
  // =========================

  const totalUsers = users.length;

  return (
    <div className="space-y-4">
      {/* =========================
          STATS
      ========================= */}

      <StatRow
        items={[
          {
            label: "Total Users",
            value: totalUsers,
          },
          {
            label: "Active Users",
            value: 0,
          },
          {
            label: "Inactive Users",
            value: 0,
          },
          {
            label: "Offline",
            value: 0,
          },
        ]}
      />

      {/* =========================
          USERS CRUD
      ========================= */}

      <SectionCard>
        <UserCRUD />
      </SectionCard>
    </div>
  );
}
