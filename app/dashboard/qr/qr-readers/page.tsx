"use client";

import ReaderCRUD from "@/components/cameras/ReaderCRUD";

export default function CamerasPage() {
  return (
    <div className="space-y-6">
      {/* CRUD */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <ReaderCRUD />
      </div>
    </div>
  );
}
