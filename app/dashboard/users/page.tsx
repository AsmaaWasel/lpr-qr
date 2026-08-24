"use client";

import UserCRUD from "@/modules/sharedComponents/users/UserCRUD";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* CRUD */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <UserCRUD />
      </div>
    </div>
  );
}
