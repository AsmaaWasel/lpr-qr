// components/QRTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QRCode } from "@/hooks/useQRs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Copy, Check, Eye, QrCode, User, Building2, Key } from "lucide-react";
import Image from "next/image";

type Props = {
  data: QRCode[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function QRTable({ data, selectedId, onSelect }: Props) {
  const pathname = usePathname();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // تحديد المسار الأساسي
  const getBasePath = () => {
    if (pathname?.startsWith("/dashboard/qr")) {
      return "/dashboard/qr";
    }
    return "/dashboard/qr";
  };

  const basePath = getBasePath();

  // نسخ التوكين
  const handleCopy = (token: string, id: number) => {
    navigator.clipboard.writeText(token).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // تنسيق التاريخ (إذا كان موجوداً)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // نوع الـ QR
  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      resident: { label: "Resident", color: "bg-blue-500/10 text-brand" },
      guest: { label: "Guest", color: "bg-purple-500/10 text-purple-400" },
      delivery: {
        label: "Delivery",
        color: "bg-orange-500/10 text-orange-400",
      },
      employee: { label: "Employee", color: "bg-green-500/10 text-green-400" },
    };

    const typeInfo = types[type.toLowerCase()] || {
      label: type,
      color: "bg-slate-500/10 text-muted-foreground",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    );
  };

  return (
    <div className="border border-border rounded-2xl bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Creator Type</TableHead>

            <TableHead className="text-muted-foreground">Creator ID</TableHead>
            <TableHead className="text-muted-foreground">Building</TableHead>
            <TableHead className="text-muted-foreground">Uses</TableHead>
            <TableHead className="text-muted-foreground">Max Uses</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((qr) => {
            const selected = selectedId === qr.id;

            return (
              <TableRow
                key={qr.id}
                onClick={() => onSelect(qr.id)}
                className={`cursor-pointer ${selected ? "bg-sky-500/10" : ""}`}
              >
                <TableCell>{getTypeBadge(qr.type)}</TableCell>

                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>#{qr.resident_id}</span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{qr.building_number || "N/A"}</span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  <span className="font-medium">{qr.used_count}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    / {qr.max_uses}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {qr.max_uses === 0 ? (
                    <span className="text-brand">∞</span>
                  ) : (
                    qr.max_uses
                  )}
                </TableCell>
              </TableRow>
            );
          })}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground py-8"
              >
                <div className="flex flex-col items-center gap-2">
                  <QrCode className="w-12 h-12 text-foreground" />
                  <p>No QR codes found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
