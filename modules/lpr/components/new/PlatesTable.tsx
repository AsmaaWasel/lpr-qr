"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plate } from "../../../types/plate";

type Props = {
  data: Plate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function PlateTable({ data, selectedId, onSelect }: Props) {
  const router = useRouter();

  // ================= FORMAT PLATE NUMBER =================
  const formatPlateNumber = (plate: string) => {
    if (!plate) return "";

    // إزالة المسافات
    const clean = plate.replace(/\s/g, "");

    // استخراج الأرقام
    const numbers = clean.match(/\d+/g)?.join("") || "";

    // استخراج الحروف
    const letters = clean.match(/[^\d]+/g)?.join("") || "";

    // فصل الحروف بمسافات
    const spacedLetters = letters.split("").join(" ");

    // أرقام ثم حروف
    if (numbers && letters && clean.startsWith(numbers)) {
      return `${numbers} ${spacedLetters}`;
    }

    // حروف ثم أرقام
    if (letters && numbers && clean.startsWith(letters)) {
      return `${spacedLetters} ${numbers}`;
    }

    // حروف فقط
    if (!numbers && letters) {
      return spacedLetters;
    }

    // أرقام فقط
    if (numbers && !letters) {
      return numbers;
    }

    return clean;
  };

  // ================= OPEN DETAILS =================
  const handleOpenDetails = (plateId: number) => {
    router.push("/dashboard/residents");
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-border
        bg-card
        shadow-sm

      "
    >
      <Table>
        {/* ================= HEADER ================= */}
        <TableHeader>
          <TableRow
            className="
              border-0
              bg-secondary
              hover:bg-secondary

              dark:bg-slate-800/60
              dark:hover:bg-slate-800/60
            "
          >
            {/* Selection */}
            <TableHead className="w-[65px] px-6 py-4">
              <span className="sr-only">Select</span>
            </TableHead>

            {/* Plate Number */}
            <TableHead className="px-6 py-4">
              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-muted-foreground
                "
              >
                Plate Number
              </span>
            </TableHead>

            {/* Resident Name */}
            <TableHead className="px-6 py-4">
              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-muted-foreground
                "
              >
                Resident Name
              </span>
            </TableHead>

            {/* Actions */}
            <TableHead className="px-6 py-4 text-right">
              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-muted-foreground
                "
              >
                Actions
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody>
          {data.map((plate) => {
            const selected = selectedId === plate.id;

            return (
              <TableRow
                key={plate.id}
                onClick={() => onSelect(plate.id)}
                className={`
                  cursor-pointer
                  border-t
                  border-border
                  transition-colors

                  hover:bg-secondary

                  dark:hover:bg-slate-800/60

                  ${selected ? "bg-cyan-50/60 dark:bg-cyan-500/10" : ""}
                `}
              >
                {/* ================= CHECKBOX ================= */}
                <TableCell className="px-6 py-5">
                  <div
                    className={`
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-md
                      border
                      transition-all

                      ${
                        selected
                          ? `
                            border-brand
                            bg-brand
                            text-white
                          `
                          : `
                            border-slate-300
                            bg-card

                            dark:border-slate-600

                          `
                      }
                    `}
                  >
                    {selected && <Check size={13} strokeWidth={3} />}
                  </div>
                </TableCell>

                {/* ================= PLATE NUMBER ================= */}
                <TableCell className="px-6 py-5">
                  <span
                    className="
                      text-sm
                      font-bold
                      text-foreground

                      dark:text-white
                    "
                  >
                    {formatPlateNumber(plate.plate_number_full)}
                  </span>
                </TableCell>

                {/* ================= RESIDENT NAME ================= */}
                <TableCell className="px-6 py-5">
                  <span
                    className="
                      text-sm
                      font-medium
                      text-foreground

                    "
                  >
                    {plate.resident?.full_name || "N/A"}
                  </span>
                </TableCell>

                {/* ================= ACTIONS ================= */}
                <TableCell className="px-6 py-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(plate.id);
                    }}
                    className="
                      inline-flex
                      items-center
                      rounded-lg
                      bg-accent
                      px-3
                      py-1.5
                      text-[11px]
                      font-bold
                      text-brand
                      transition-colors

                      hover:bg-accent

                      dark:bg-cyan-500/10

                      dark:hover:bg-cyan-500/20
                    "
                  >
                    Open Details
                  </button>
                </TableCell>
              </TableRow>
            );
          })}

          {/* ================= EMPTY STATE ================= */}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="
                  h-40
                  text-center
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                No plates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
