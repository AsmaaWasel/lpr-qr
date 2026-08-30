"use client";

import { useState } from "react";

import { generateQR } from "@/services/qr";



import { QR_TABS, PillTabs } from "@/shared/ui/voom";
import QRForm, { QRFormData } from "@/components/qr/QrForm";
import QRDisplay from "@/components/qr/QrDisplaty";

// =====================================================
// MAIN PAGE
// =====================================================

export default function QRPage() {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QRFormData>({
    buildingNumber: "",
    residentId: "",
    maxUses: 1,
    visitorFullName: "",
    visitorNationalId: "",
    visitorPhoneNumber: "",
    startDate: undefined,
    expiryDate: undefined,
  });

  // =====================================================
  // HANDLE GENERATE
  // =====================================================

  const handleGenerate = async (data: QRFormData) => {
    try {
      setError(null);
      setFormData(data);

      // =========================
      // VALIDATION
      // =========================

      if (!data.buildingNumber.trim()) {
        setError("Please enter building number.");
        return;
      }

      if (!data.residentId.trim()) {
        setError("Please enter resident ID.");
        return;
      }

      if (!data.visitorFullName.trim()) {
        setError("Please enter visitor full name.");
        return;
      }

      if (!data.visitorNationalId.trim()) {
        setError("Please enter visitor national ID.");
        return;
      }

      if (!data.visitorPhoneNumber.trim()) {
        setError("Please enter visitor phone number.");
        return;
      }

      if (!data.startDate) {
        setError("Please select start date.");
        return;
      }

      if (!data.expiryDate) {
        setError("Please select expiry date.");
        return;
      }

      if (data.expiryDate < data.startDate) {
        setError("Expiry date cannot be before start date.");
        return;
      }

      setLoading(true);

      // =====================================================
      // DATE FORMATTING
      // =====================================================

      const startAt = new Date(data.startDate);
      startAt.setHours(0, 0, 0, 0);

      const expiry = new Date(data.expiryDate);
      expiry.setHours(23, 59, 59, 999);

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        building_number: data.buildingNumber.trim(),
        resident_id: Number(data.residentId),
        max_uses: data.maxUses,
        start_at: startAt.toISOString(),
        expiry_date: expiry.toISOString(),
        visitor_national_id: data.visitorNationalId.trim(),
        visitor_phone_number: data.visitorPhoneNumber.trim(),
        visitor_full_name: data.visitorFullName.trim(),
      };

      console.log("QR Payload:", payload);

      // =====================================================
      // API
      // =====================================================

      const response = await generateQR(payload);

      setQrData(response);
    } catch (err) {
      console.error("Generate QR Error:", err);

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

    setFormData({
      buildingNumber: "",
      residentId: "",
      maxUses: 1,
      visitorFullName: "",
      visitorNationalId: "",
      visitorPhoneNumber: "",
      startDate: undefined,
      expiryDate: undefined,
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6 pb-28">
      {/* =====================================================
          TABS
      ===================================================== */}

      <PillTabs tabs={QR_TABS} activeValue="/dashboard/qr/qr-generator" />

      {/* =====================================================
          CONTENT
          FORM = 8 COLUMNS
          QR DISPLAY = 4 COLUMNS
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="xl:col-span-8">
          <QRForm onGenerate={handleGenerate} loading={loading} error={error} />
        </div>

        {/* =====================================================
            QR DISPLAY
        ===================================================== */}

        <div className="xl:col-span-4">
          <QRDisplay
            qrData={qrData}
            loading={loading}
            formData={formData}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
