"use client";

import { useEffect, useState } from "react";

import { Share2, QrCode, Download, RotateCcw, Loader2 } from "lucide-react";

import { QRFormData } from "./Qrform";

import { getResidents } from "@/services/resident";

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

type Resident = {
  id: number;
  full_name: string;
  phone_number: string;
  type: string;
  national_id?: number;
  building_number?: string | number;
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
  const [resident, setResident] = useState<Resident | null>(null);
  const [loadingResident, setLoadingResident] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // =====================================================
  // GET RESIDENT DATA
  // =====================================================

  useEffect(() => {
    const fetchResident = async () => {
      if (!qrData?.resident_id) {
        setResident(null);
        return;
      }

      try {
        setLoadingResident(true);

        const residents = await getResidents(0, 100);

        const foundResident = residents.find(
          (item: Resident) => Number(item.id) === Number(qrData.resident_id),
        );

        setResident(foundResident ?? null);
      } catch (error) {
        console.error("Failed to fetch resident:", error);
        setResident(null);
      } finally {
        setLoadingResident(false);
      }
    };

    fetchResident();
  }, [qrData?.resident_id]);

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
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }

      const blob = await response.blob();

      const file = new File([blob], "qr-code.png", {
        type: blob.type || "image/png",
      });

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

      console.error("This browser/device does not support sharing images.");
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // =====================================================
  // DOWNLOAD QR IMAGE
  // =====================================================

  const handleDownload = async () => {
    if (!qrData) return;

    const imageUrl = getQrImageUrl();

    try {
      setDownloading(true);

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = "qr-code.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  // =====================================================
  // RESIDENT NAME
  // =====================================================

  const residentName = resident?.full_name || "-";

  // =====================================================
  // BUILDING NUMBER
  // =====================================================

  const buildingNumber =
    qrData?.building_number || resident?.building_number || "-";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        flex
        min-h-[300px]
        w-full
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-[#132f49]
        p-4
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
            {/* =========================================== */}
            {/* QR INFO */}
            {/* =========================================== */}

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
                  {loadingResident ? (
                    <Loader2 size={13} className="mx-auto animate-spin" />
                  ) : (
                    buildingNumber
                  )}
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
                  {loadingResident ? (
                    <Loader2 size={13} className="mx-auto animate-spin" />
                  ) : (
                    residentName
                  )}
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
                  {qrData.visitor_full_name || formData.visitorFullName || "-"}
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
              {/* Share */}

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

              {/* Download */}

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {downloading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}

                {downloading ? "Downloading..." : "Download"}
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
