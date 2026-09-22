"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

/* ---------------- COMPONENT ---------------- */

export function DataTable<T extends { id: number }>({
  data,
  columns,
  selectedId,
  onSelect,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border bg-card ">
      <div className="overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              {onSelect && <TableHead className="w-10" />}

              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {data.map((row) => {
              const isSelected = selectedId === row.id;

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    onSelect && "cursor-pointer",
                    isSelected && "bg-accent dark:bg-blue-900/20",
                  )}
                  onClick={() => onSelect?.(row.id)}
                >
                  {/* Checkbox */}
                  {onSelect && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(row.id)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {/* Cells */}
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(row) : String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
