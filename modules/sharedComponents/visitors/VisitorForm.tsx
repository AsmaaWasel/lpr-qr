"use client";

import { IdentityVisitor } from "@/modules/types/visitor";
import { useState } from "react";

type FormData = {
  full_name: string;

  id_number: string;

  document_type: string;

  birth_date: string;

  expiry_date: string;

  address: string;
};

type Props = {
  editing: IdentityVisitor | null;

  onClose: () => void;

  onSubmit: (data: FormData) => void;
};

export default function IdentityVisitorForm({
  editing,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormData>({
    full_name: editing?.full_name || "",

    id_number: editing?.id_number || "",

    document_type: editing?.document_type || "",

    birth_date: editing?.birth_date || "",

    expiry_date: editing?.expiry_date || "",

    address: editing?.address || "",
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-xl rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {editing ? "Edit Visitor" : "Add Visitor"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit(form);
          }}
          className="space-y-4"
        >
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <input
            placeholder="ID Number"
            value={form.id_number}
            onChange={(e) =>
              setForm({
                ...form,
                id_number: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <input
            placeholder="Document Type"
            value={form.document_type}
            onChange={(e) =>
              setForm({
                ...form,
                document_type: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <input
            type="date"
            value={form.birth_date}
            onChange={(e) =>
              setForm({
                ...form,
                birth_date: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <input
            type="date"
            value={form.expiry_date}
            onChange={(e) =>
              setForm({
                ...form,
                expiry_date: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            className="w-full bg-black/30 border border-border rounded-xl p-3 text-foreground"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-secondary text-foreground"
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
