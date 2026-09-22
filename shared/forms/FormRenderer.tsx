"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ---------------- TYPES ---------------- */

type FieldType = "text" | "number" | "select";

type Field<T> = {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

type Props<T> = {
  fields: Field<T>[];
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
};

/* ---------------- COMPONENT ---------------- */

export function FormRenderer<T extends Record<string, string | number>>({
  fields,
  form,
  setForm,
}: Props<T>) {
  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const value = form[field.name];

        if (field.type === "text" || field.type === "number") {
          return (
            <Input
              key={String(field.name)}
              type={field.type}
              name={String(field.name)}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) =>
                handleChange(field.name, e.target.value as T[typeof field.name])
              }
            />
          );
        }

        if (field.type === "select") {
          return (
            <Select
              key={String(field.name)}
              value={String(value)}
              onValueChange={(v) =>
                handleChange(field.name, v as T[typeof field.name])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>

              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return null;
      })}
    </div>
  );
}
