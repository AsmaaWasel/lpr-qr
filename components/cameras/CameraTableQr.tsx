// CameraTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Camera } from "@/modules/types/camera";
import Link from "next/link";

type Props = {
  data: Camera[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CameraTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="border border-border rounded-2xl bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead />
            <TableHead className="text-muted-foreground">Location</TableHead>
            <TableHead className="text-muted-foreground">IP</TableHead>
            <TableHead className="text-muted-foreground">Port</TableHead>
            <TableHead className="text-muted-foreground">Gate ID</TableHead>
            <TableHead className="text-muted-foreground">URL</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((cam) => {
            const selected = selectedId === cam.id;

            return (
              <TableRow
                key={cam.id}
                onClick={() => onSelect(cam.id)}
                className={`cursor-pointer ${selected ? "bg-sky-500/10" : ""}`}
              >
                <TableCell>
                  <input type="checkbox" checked={selected} readOnly />
                </TableCell>

                <TableCell className="text-foreground">{cam.location}</TableCell>

                <TableCell className="text-muted-foreground">
                  {cam.ip_address}
                </TableCell>

                <TableCell className="text-muted-foreground">{cam.port}</TableCell>

                <TableCell className="text-muted-foreground">{cam.gate_id}</TableCell>

                <TableCell className="text-muted-foreground break-all max-w-md">
                  {cam.url ? (
                    <Link
                      href={`/dashboard/qr/cameras/${cam.id}`}
                      className="text-brand hover:text-brand underline"
                    >
                      {cam.url}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">No URL</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No cameras found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
