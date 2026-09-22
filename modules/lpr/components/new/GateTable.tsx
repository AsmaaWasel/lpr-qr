"use client";

import { Check } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Gate } from "@/modules/types/gate";

type Props = {
  data: Gate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function GateTable({ data, selectedId, onSelect }: Props) {
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

            {/* Gate Name */}
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
                Gate Name
              </span>
            </TableHead>

            {/* Type */}
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
                Type
              </span>
            </TableHead>

            {/* IP */}
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
                IP Address
              </span>
            </TableHead>

            {/* Description */}
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
                Description
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody>
          {data.map((gate) => {
            const selected = selectedId === gate.id;

            return (
              <TableRow
                key={gate.id}
                onClick={() => onSelect(gate.id)}
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

                {/* ================= GATE NAME ================= */}
                <TableCell className="px-6 py-5">
                  <div className="flex flex-col">
                    <span
                      className="
                        text-sm
                        font-bold
                        text-foreground

                        dark:text-white
                      "
                    >
                      {gate.name}
                    </span>

                    <span
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {gate.desc}
                    </span>
                  </div>
                </TableCell>

                {/* ================= TYPE ================= */}
                <TableCell className="px-6 py-5">
                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-lg
                      px-3
                      py-1.5
                      text-[11px]
                      font-bold

                      ${
                        gate.type === "ENTRY"
                          ? `
                            bg-accent
                            text-brand

                            dark:bg-blue-500/10

                          `
                          : `
                            bg-secondary
                            text-foreground

                            dark:bg-slate-700

                          `
                      }
                    `}
                  >
                    {gate.type}
                  </span>
                </TableCell>

                {/* ================= IP ADDRESS ================= */}
                <TableCell className="px-6 py-5">
                  <span
                    className="
                      whitespace-nowrap
                      text-sm
                      font-semibold
                      text-brand
                    "
                  >
                    {gate.ip}
                  </span>
                </TableCell>

                {/* ================= DESCRIPTION ================= */}
                <TableCell className="px-6 py-5">
                  <span
                    className="
                      text-sm
                      font-medium
                      text-foreground

                    "
                  >
                    {gate.desc}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}

          {/* ================= EMPTY STATE ================= */}
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="
                  h-40
                  text-center
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                No gates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
