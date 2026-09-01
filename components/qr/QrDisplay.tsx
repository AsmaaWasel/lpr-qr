"use client";

import { useState } from "react";

import { Share2, QrCode, Copy, Check, RotateCcw, Loader2 } from "lucide-react";

import { QRFormData } from "./Qrform";

// =====================================================
// TYPES
// =====================================================

export type QRResponse = {
  qr_image: string;
  building_number?: string;
  resident_id?: number;
  max_uses?: number;
  start_at?: string;
  expiry_date?: string;
  visitor_national_id?: string;
  visitor_phone_number?: string;
  visitor_full_name?: string;
};

type QRDisplayProps = {
  qrData: QRResponse | null;
  loading: boolean;
  formData: QRFormData;
  onReset: () => void;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function QRDisplay({
  qrData,
  loading,
  formData,
  onReset,
}: QRDisplayProps) {
  const [copied, setCopied] = useState(false);

  // =====================================================
  // QR IMAGE URL
  // =====================================================

  const getQrImageUrl = () => {
    if (!qrData?.qr_image) return "";

    return `http://127.0.0.1:8000/${qrData.qr_image}`;
  };

  // =====================================================
  // SHARE QR IMAGE
  // =====================================================

  const handleShare = async () => {
    if (!qrData) return;

    const imageUrl = getQrImageUrl();

    try {
      // تحميل صورة الـ QR من الـ backend
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }

      const blob = await response.blob();

      // تحويل الصورة إلى File
      const file = new File([blob], "qr-code.png", {
        type: blob.type || "image/png",
      });

      // مشاركة الصورة فقط
      // لا يوجد text
      // لا يوجد title
      // لا يوجد URL
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
        });

        return;
      }

      // المتصفح لا يدعم مشاركة الملفات
      console.error("This browser/device does not support sharing images.");
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // =====================================================
  // COPY IMAGE URL
  // =====================================================

  const handleCopy = async () => {
    if (!qrData) return;

    const imageUrl = getQrImageUrl();

    try {
      await navigator.clipboard.writeText(imageUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        w-full
        min-h-[300px]
        rounded-2xl
        border
        border-border
        bg-[#132f49]
        p-4
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      {!qrData ? (
        // =================================================
        // EMPTY / LOADING STATE
        // =================================================

        <div className="flex flex-col items-center justify-center py-8 text-center">
          {loading ? (
            <>
              <Loader2 size={32} className="mb-3 animate-spin text-white" />

              <h2 className="text-sm font-semibold text-white">
                Generating QR...
              </h2>

              <p className="mt-1 text-xs text-white/60">Please wait</p>
            </>
          ) : (
            <>
              <QrCode size={36} className="mb-3 text-white/50" />

              <h2 className="text-xl font-bold text-white">No QR Generated</h2>

              <p className="mt-2 max-w-[320px] text-sm text-white/50">
                Fill the information above and generate a QR code
              </p>
            </>
          )}
        </div>
      ) : (
        // =================================================
        // QR RESULT
        // =================================================

        <div
          className="
            flex
            w-full
            flex-col
            items-center
            justify-center
            gap-5
            sm:flex-row
            sm:items-center
          "
        >
          {/* ============================================= */}
          {/* QR IMAGE */}
          {/* ============================================= */}

          <div
            className="
              flex
              h-[180px]
              w-[180px]
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              p-2
              shadow-lg
              sm:h-[200px]
              sm:w-[200px]
            "
          >
            <img
              src={getQrImageUrl()}
              alt="QR Code"
              className="
                h-full
                w-full
                rounded-md
                object-contain
              "
            />
          </div>

          {/* ============================================= */}
          {/* INFO + ACTIONS */}
          {/* ============================================= */}

          <div className="w-full min-w-0 flex-1">
            {/* QR INFO */}

            <div className="mb-3 grid grid-cols-2 gap-2">
              {/* Building */}

              <div
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  backdrop-blur-sm
                "
              >
                <p className="text-center text-[9px] font-medium uppercase tracking-wider text-white/60">
                  Building
                </p>

                <p className="mt-1 truncate text-center text-xs font-bold text-white">
                  {qrData.building_number ?? "-"}
                </p>
              </div>

              {/* Resident */}

              <div
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  backdrop-blur-sm
                "
              >
                <p className="text-center text-[9px] font-medium uppercase tracking-wider text-white/60">
                  Resident
                </p>

                <p className="mt-1 truncate text-center text-xs font-bold text-white">
                  {qrData.resident_id ?? formData.residentId ?? "-"}
                </p>
              </div>

              {/* Visitor */}

              <div
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  backdrop-blur-sm
                "
              >
                <p className="text-center text-[9px] font-medium uppercase tracking-wider text-white/60">
                  Visitor
                </p>

                <p className="mt-1 truncate text-center text-xs font-bold text-white">
                  {qrData.visitor_full_name ?? formData.visitorFullName ?? "-"}
                </p>
              </div>

              {/* Max Uses */}

              <div
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  backdrop-blur-sm
                "
              >
                <p className="text-center text-[9px] font-medium uppercase tracking-wider text-white/60">
                  Max Uses
                </p>

                <p className="mt-1 text-center text-xs font-bold text-white">
                  {qrData.max_uses ?? formData.maxUses ?? "-"}
                </p>
              </div>
            </div>

            {/* =========================================== */}
            {/* ACTIONS */}
            {/* =========================================== */}

            <div className="flex flex-wrap items-center gap-2">
              {/* Share QR Image */}

              <button
                type="button"
                onClick={handleShare}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-[#25D366]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-[#20BD5A]
                  active:scale-[0.98]
                "
              >
                <Share2 size={13} />
                Share
              </button>

              {/* Copy */}

              <button
                type="button"
                onClick={handleCopy}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/20
                  bg-white/20
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  backdrop-blur-sm
                  transition
                  hover:bg-white/30
                  active:scale-[0.98]
                "
              >
                {copied ? (
                  <Check size={13} className="text-green-400" />
                ) : (
                  <Copy size={13} />
                )}

                {copied ? "Copied!" : "Copy"}
              </button>

              {/* New QR */}

              <button
                type="button"
                onClick={onReset}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-white/30
                  bg-transparent
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white/80
                  transition
                  hover:bg-white/10
                  hover:text-white
                  active:scale-[0.98]
                "
              >
                <RotateCcw size={13} />
                New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
