"use client";

import { useState } from "react";
import { Share2, QrCode, Check, RotateCcw, Loader2 } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

export type QRResidentResponse = {
  qr_image: string;
  building_number?: string;
  resident_id?: number;
  resident_name?: string;
};

type QRResidentDisplayProps = {
  qrData: QRResidentResponse | null;
  loading: boolean;
  residentName?: string;
  onReset: () => void;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function QRResidentDisplay({
  qrData,
  loading,
  residentName,
  onReset,
}: QRResidentDisplayProps) {
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
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch QR image");
      }

      const blob = await response.blob();

      const file = new File([blob], "qr-code.png", {
        type: blob.type || "image/png",
      });

      // Share image only
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
        p-6
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      {!qrData ? (
        // =================================================
        // EMPTY / LOADING
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
              <QrCode size={42} className="mb-3 text-white/50" />

              <h2 className="text-xl font-bold text-white">No QR Generated</h2>

              <p className="mt-2 text-sm text-white/50">
                Generate a QR code to display it here
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
          "
        >
          {/* ============================================= */}
          {/* QR IMAGE */}
          {/* ============================================= */}

          <div
            className="
              flex
              h-[220px]
              w-[220px]
              items-center
              justify-center
              rounded-2xl
              bg-white
              p-3
              shadow-xl
            "
          >
            <img
              src={getQrImageUrl()}
              alt="Resident QR Code"
              className="
                h-full
                w-full
                rounded-lg
                object-contain
              "
            />
          </div>

          {/* ============================================= */}
          {/* INFO */}
          {/* ============================================= */}

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            {/* BUILDING */}

            <div
              className="
                rounded-xl
                border
                border-white/20
                bg-white/10
                px-4
                py-3
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-center
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Building
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-center
                  text-sm
                  font-bold
                  text-white
                "
              >
                {qrData.building_number ?? "-"}
              </p>
            </div>

            {/* RESIDENT */}

            <div
              className="
                rounded-xl
                border
                border-white/20
                bg-white/10
                px-4
                py-3
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-center
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Resident
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-center
                  text-sm
                  font-bold
                  text-white
                "
              >
                {qrData.resident_name ??
                  residentName ??
                  qrData.resident_id ??
                  "-"}
              </p>
            </div>
          </div>

          {/* ============================================= */}
          {/* ACTIONS */}
          {/* ============================================= */}

          <div className="flex items-center gap-2">
            {/* SHARE */}

            <button
              type="button"
              onClick={handleShare}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                bg-[#25D366]
                px-4
                py-2.5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-[#20BD5A]
                active:scale-[0.98]
              "
            >
              <Share2 size={14} />
              Share
            </button>

            {/* COPY */}

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
                px-4
                py-2.5
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
                <Check size={14} className="text-green-400" />
              ) : (
                <QrCode size={14} />
              )}

              {copied ? "Copied!" : "Copy"}
            </button>

            {/* NEW QR */}

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
                px-4
                py-2.5
                text-xs
                font-medium
                text-white/80
                transition
                hover:bg-white/10
                hover:text-white
                active:scale-[0.98]
              "
            >
              <RotateCcw size={14} />
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
