// hooks/useQRs.ts
import { getQRs } from "@/services/qr";
import { useEffect, useState } from "react";

export type QRCode = {
  id: number;
  token: string;
  type: string;
  resident_id: number;
  building_number: string;
  created_by_id: number;
  created_by_type: string;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  qr_image: string;
};

export function useQRs() {
  const [data, setData] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQRs = async () => {
    try {
      setLoading(true);
      const response = await getQRs();
      // التأكد من أن البيانات عبارة عن array
      setData(Array.isArray(response) ? response : response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch QR codes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  return { data, loading, error, refetch: fetchQRs };
}
