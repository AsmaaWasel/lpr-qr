// components/reports.tsx/QRVisitorLogsTable.tsx

"use client";

import { QrCode, UserRound, DoorOpen, CalendarDays } from "lucide-react";

export type QRVisitorLog = {
  id: string;
  qrCodeId: string;
  visitor: string;
  hostResident: string;
  gate: string;
  dateTime: string;
  result: "Allowed" | "Denied" | "Pending";
};

type QRVisitorLogsTableProps = {
  logs?: QRVisitorLog[];
};

const demoLogs: QRVisitorLog[] = [
  {
    id: "1",
    qrCodeId: "QR-00125",
    visitor: "Ahmed Mohamed",
    hostResident: "Mohamed Ali",
    gate: "Gate 01",
    dateTime: "25 Aug 2026, 10:30 AM",
    result: "Allowed",
  },
  {
    id: "2",
    qrCodeId: "QR-00126",
    visitor: "Sara Ahmed",
    hostResident: "Omar Hassan",
    gate: "Gate 02",
    dateTime: "25 Aug 2026, 11:15 AM",
    result: "Denied",
  },
  {
    id: "3",
    qrCodeId: "QR-00127",
    visitor: "Mostafa Khaled",
    hostResident: "Ahmed Samir",
    gate: "Gate 01",
    dateTime: "25 Aug 2026, 12:05 PM",
    result: "Allowed",
  },
];

export default function QRVisitorLogsTable({
  logs = demoLogs,
}: QRVisitorLogsTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-[24px] bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <TableHeader>
                <QrCode size={16} />
                QR CODE ID
              </TableHeader>

              <TableHeader>
                <UserRound size={16} />
                VISITOR
              </TableHeader>

              <TableHeader>HOST RESIDENT</TableHeader>

              <TableHeader>
                <DoorOpen size={16} />
                GATE
              </TableHeader>

              <TableHeader>
                <CalendarDays size={16} />
                DATE & TIME
              </TableHeader>

              <TableHeader>RESULT</TableHeader>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
                    font-medium
                    text-muted-foreground
                  "
                >
                  No visitor logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="
                    border-b
                    border-border
                    transition-colors
                    last:border-0
                    hover:bg-secondary/30
                  "
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-foreground">
                      {log.qrCodeId}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-foreground">
                      {log.visitor}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-foreground">
                      {log.hostResident}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-muted-foreground">
                      {log.gate}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-muted-foreground">
                      {log.dateTime}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <ResultBadge result={log.result} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="
        whitespace-nowrap
        px-5
        py-4
        text-left
        text-xs
        font-bold
        uppercase
        tracking-wide
        text-muted-foreground
      "
    >
      <div className="flex items-center gap-2">{children}</div>
    </th>
  );
}

function ResultBadge({ result }: { result: QRVisitorLog["result"] }) {
  const styles = {
    Allowed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

    Denied: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    Pending:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-bold
        ${styles[result]}
      `}
    >
      {result}
    </span>
  );
}
