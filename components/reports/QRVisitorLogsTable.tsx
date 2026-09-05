"use client";

import {
  Car,
  User,
  Calendar,
  Image as ImageIcon,
  Hash,
  QrCode,
  LogIn,
  LogOut,
  IdCard,
  Phone,
} from "lucide-react";

import { VisitorLog } from "@/services/visitorLogs";

type Props = {
  data: VisitorLog[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onImageClick: (url: string) => void;
};

export default function QRVisitorLogsTable({
  data,
  selectedId,
  onSelect,
  onImageClick,
}: Props) {
  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "entered") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-emerald-50
            px-3
            py-1
            text-xs
            font-[600]
            text-emerald-600
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <LogIn className="h-3.5 w-3.5" />
          Entered
        </span>
      );
    }

    if (normalized === "exited") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-red-50
            px-3
            py-1
            text-xs
            font-[600]
            text-red-600
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          <LogOut className="h-3.5 w-3.5" />
          Exited
        </span>
      );
    }

    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-orange-50
          px-3
          py-1
          text-xs
          font-[600]
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        "
      >
        {status}
      </span>
    );
  };

  // =========================
  // GET PHONE NUMBER
  // =========================

  const getPhoneNumber = (resident: any) => {
    if (!resident) return "-";
    if (resident.phone_numbers && resident.phone_numbers.length > 0) {
      return resident.phone_numbers[0].phone_number;
    }
    return "-";
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        bg-card
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          {/* =========================
              HEADER
          ========================= */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                dark:bg-slate-800/40
              "
            >
              {/* QR Code */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                QR Code
              </th>

              {/* Visitor */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor
              </th>

              {/* Visitor National ID */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor National ID
              </th>

              {/* Visitor Phone */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Visitor Phone
              </th>

              {/* Resident */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Resident
              </th>

              {/* Resident National ID */}
              {/* <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Resident National ID
              </th> */}

              {/* Resident Phone */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Resident Phone
              </th>

              {/* Plate Number */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Plate Number
              </th>

              {/* Status */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Status
              </th>

              {/* Created By */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Created By
              </th>

              {/* Entry Time */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Entry Time
              </th>

              {/* Exit Time */}
              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-[600]
                  uppercase
                  tracking-wide
                  text-[#7C93B4]
                "
              >
                Exit Time
              </th>
            </tr>
          </thead>

          {/* =========================
              BODY
          ========================= */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  <div className="flex flex-col items-center gap-3">
                    <QrCode
                      className="
                        h-10
                        w-10
                        text-muted-foreground
                      "
                    />

                    <p className="text-lg font-medium">
                      No QR visitor logs found
                    </p>

                    <p className="text-lg text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((log) => {
                const isSelected = selectedId === log.id;

                return (
                  <tr
                    key={log.id}
                    onClick={() => onSelect(log.id)}
                    className={`
                      cursor-pointer
                      border-b
                      border-border
                      transition
                      last:border-b-0
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* =========================
                        QR CODE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <QrCode
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-foreground
                              dark:text-white
                            "
                          >
                            {log.qr_code_id ? `QR #${log.qr_code_id}` : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <User
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-foreground
                              dark:text-white
                            "
                          >
                            {log.visitor_full_name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR NATIONAL ID
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <IdCard
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />
                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.visitor_national_id || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        VISITOR PHONE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />
                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.visitor_phone_number || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        RESIDENT
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <User
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <div>
                          <p
                            className="
                              text-[18px]
                              font-[600]
                              text-[#3B5473]
                              dark:text-white
                            "
                          >
                            {log.resident?.full_name || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        RESIDENT NATIONAL ID
                    ========================= */}

                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <IdCard
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />
                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.resident?.national_id || "-"}
                        </span>
                      </div>
                    </td> */}

                    {/* =========================
                        RESIDENT PHONE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />
                        <span
                          className="
                            font-mono
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {getPhoneNumber(log.resident)}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        PLATE
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Car
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            font-mono
                            text-[18px]
                            font-[600]
                            text-foreground
                            dark:text-white
                          "
                        >
                          {log.plate_number || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        STATUS
                    ========================= */}

                    <td className="px-6 py-4">{getStatusBadge(log.status)}</td>

                    {/* =========================
                        CREATED BY
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {log.created_by?.name || "-"}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        ENTRY TIME
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {formatDate(log.entry_time)}
                        </span>
                      </div>
                    </td>

                    {/* =========================
                        EXIT TIME
                    ========================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="
                            h-4
                            w-4
                            text-[#29C5E8]
                          "
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {formatDate(log.exit_time)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
