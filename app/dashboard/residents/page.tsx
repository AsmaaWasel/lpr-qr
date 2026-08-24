// app/residents/page.tsx
"use client";

import ResidentCRUD from "@/modules/sharedComponents/residents/ResidentCRUD";

export default function ResidentsPage() {
  return (
    <div className="space-y-6">
      {/* CRUD */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <ResidentCRUD />
      </div>
    </div>
  );
}
