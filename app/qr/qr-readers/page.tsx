"use client";

import CameraCRUD from "@/components/cameras/ReaderCRUD";

export default function CamerasPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Readers</h1>

          <p className="text-muted-foreground mt-1">
            Manage system readers and entry points
          </p>
        </div>
      </div>

      {/* CRUD */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <CameraCRUD />
      </div>
    </div>
  );
}
