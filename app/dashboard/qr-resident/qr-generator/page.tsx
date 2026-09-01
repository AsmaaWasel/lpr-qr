"use client";

import { useState } from "react";

import { createResidentQR } from "@/services/qr";
import QRResidentDisplay, { QRResidentResponse } from "@/components/qr/QRResidentDisplay";
import QRResidentForm, { QRResidentFormData } from "@/components/qr/QRResientForm";



// =====================================================
// MAIN PAGE
// =====================================================

export default function QRResidentPage() {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResidentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // HANDLE GENERATE
  // =====================================================

  const handleGenerate = async (data: QRResidentFormData) => {
    try {
      setError(null);
      setLoading(true);

      // =========================
      // PAYLOAD
      // =========================

      const payload = {
        max_uses: data.max_uses,

        start_at: data.start_at,

        expiry_date: data.expiry_date,

        visitor_national_id: data.visitor_national_id.trim(),

        visitor_phone_number: data.visitor_phone_number.trim(),

        visitor_full_name: data.visitor_full_name.trim(),
      };

      console.log("Resident QR Payload:", payload);

      // =========================
      // API REQUEST
      // =========================

      const response = await createResidentQR(payload);

      console.log("Resident QR Response:", response);

      setQrData(response);
    } catch (err) {
      console.error("Generate Resident QR Error:", err);

      setError("Please try again later. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE RESET
  // =====================================================

  const handleReset = () => {
    setQrData(null);
    setError(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6 pb-28">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* FORM */}

        <div className="xl:col-span-8">
          <QRResidentForm
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
          />
        </div>

        {/* QR DISPLAY */}

        <div className="xl:col-span-4">
          <QRResidentDisplay
            qrData={qrData}
            loading={loading}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
