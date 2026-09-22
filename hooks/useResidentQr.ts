import { useState } from "react";
import { toast } from "sonner";
import { generateResidentQr } from "@/services/owner";

export function useResidentQr() {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  const generateQR = async () => {
    try {
      setLoading(true);

      const resident_id = localStorage.getItem("resident_id");

      if (!resident_id) {
        throw new Error("Resident not found");
      }

      const blob = await generateResidentQr(Number(resident_id));

      // 🔥 تحويل Blob إلى URL
      const qrUrl = URL.createObjectURL(blob);

      setQr(qrUrl);

      toast.success("Visitor QR generated successfully");
    } catch (error) {
      toast.error("Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  return {
    qr,
    loading,
    generateQR,
  };
}
