"use client";

import { useState } from "react";
import { Share2, QrCode, Copy, Check, RotateCcw, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
    if (!qrData) return "";
    return `http://127.0.0.1:8000/${qrData.qr_image}`;
  };

  // =====================================================
  // SHARE WHATSAPP
  // =====================================================

  const handleShare = () => {
    if (!qrData) return;

    const imageUrl = getQrImageUrl();
    const {
      buildingNumber,
      residentId,
      maxUses,
      visitorFullName,
      visitorNationalId,
      visitorPhoneNumber,
      startDate,
      expiryDate,
    } = formData;

    const message = `SMARTGATE QR Access Code

Building Number: ${qrData.building_number ?? buildingNumber}
Resident ID: ${qrData.resident_id ?? residentId}
Visitor Name: ${qrData.visitor_full_name ?? visitorFullName}
Visitor National ID: ${qrData.visitor_national_id ?? visitorNationalId}
Visitor Phone: ${qrData.visitor_phone_number ?? visitorPhoneNumber}
Start Date: ${startDate ? format(startDate, "dd/MM/yyyy") : "-"}
Expiry Date: ${expiryDate ? format(expiryDate, "dd/MM/yyyy") : "-"}
Max Uses: ${qrData.max_uses ?? maxUses}

${imageUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // =====================================================
  // COPY LINK
  // =====================================================

  const handleCopy = async () => {
    if (!qrData) return;

    const imageUrl = getQrImageUrl();

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        bg-[#132f49]
        border
        border-border
        rounded-2xl
        p-3
        flex
        items-center
        justify-center
        min-h-[80px]
        max-h-[350px]
        
      "
    >
      {!qrData ? (
        <div className="flex flex-col items-center justify-center py-4">
          {loading ? (
            <>
              <Loader2 size={32} className="text-white mb-2 animate-spin" />
              <h2 className="text-white text-sm font-semibold">
                Generating QR...
              </h2>
              <p className="text-white/60 text-xs mt-1">Please wait</p>
            </>
          ) : (
            <>
              <QrCode size={32} className="text-white/50 mb-2" />
              <h2 className="text-white text-sm font-semibold">
                No QR Generated
              </h2>
              <p className="text-white/50 text-xs mt-1 text-center max-w-[150px]">
                Fill information & generate
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-row items-center gap-3 w-full">
          {/* QR IMAGE - Smaller */}
          <div className="bg-white p-2 rounded-lg shadow-lg flex-shrink-0">
            <img
              src={getQrImageUrl()}
              alt="QR"
              className="w-[80px] h-[80px] object-contain"
            />
          </div>

          {/* INFO & ACTIONS */}
          <div className="flex-1 min-w-0">
            {/* QR INFO - Compact Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {/* Building */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5">
                <p className="text-white/60 text-[8px] text-center uppercase tracking-wider">
                  Building
                </p>
                <p className="text-white text-xs font-bold text-center truncate">
                  {qrData.building_number ?? formData.buildingNumber}
                </p>
              </div>

              {/* Resident */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5">
                <p className="text-white/60 text-[8px] text-center uppercase tracking-wider">
                  Resident
                </p>
                <p className="text-white text-xs font-bold text-center truncate">
                  {qrData.resident_id ?? formData.residentId}
                </p>
              </div>

              {/* Visitor */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5">
                <p className="text-white/60 text-[8px] text-center uppercase tracking-wider">
                  Visitor
                </p>
                <p className="text-white text-xs font-bold text-center truncate">
                  {qrData.visitor_full_name ?? formData.visitorFullName}
                </p>
              </div>

              {/* Max Uses */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5">
                <p className="text-white/60 text-[8px] text-center uppercase tracking-wider">
                  Max Uses
                </p>
                <p className="text-white text-xs font-bold text-center">
                  {qrData.max_uses ?? formData.maxUses}
                </p>
              </div>
            </div>

            {/* ACTIONS - Smaller */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* WhatsApp */}
              <button
                onClick={handleShare}
                className="
                  flex
                  items-center
                  gap-1
                  bg-[#25D366]
                  hover:bg-[#20BD5A]
                  text-white
                  px-2.5
                  py-1
                  rounded-lg
                  transition
                  text-xs
                  font-medium
                "
              >
                <Share2 size={12} />
                Share
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="
                  flex
                  items-center
                  gap-1
                  bg-white/20
                  backdrop-blur-sm
                  hover:bg-white/30
                  text-white
                  px-2.5
                  py-1
                  rounded-lg
                  transition
                  text-xs
                  font-medium
                  border
                  border-white/20
                "
              >
                {copied ? (
                  <Check size={12} className="text-green-400" />
                ) : (
                  <Copy size={12} />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>

              {/* New QR */}
              <button
                onClick={onReset}
                className="
                  flex
                  items-center
                  gap-1
                  bg-transparent
                  border
                  border-white/30
                  hover:bg-white/10
                  text-white/80
                  hover:text-white
                  px-2.5
                  py-1
                  rounded-lg
                  transition
                  text-xs
                  font-medium
                "
              >
                <RotateCcw size={12} />
                New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
