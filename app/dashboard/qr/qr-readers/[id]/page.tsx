"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import api from "@/services/api";
import { useParams } from "next/navigation";

const STREAM_URL = "http://localhost:8888/cam1/index.m3u8";

export default function CameraStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { id } = useParams();

  const [loadingQR, setLoadingQR] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.error("Autoplay prevented:", err);
        });
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  // =========================
  // QR DETECT
  // =========================
  const handleQrDetect = async () => {
    try {
      setLoadingQR(true);
      setQrResult(null);

      console.log("QR SCAN for ID:", id);

      const { data } = await api.post(`/qr/qr-scan/${id}`);

      setQrResult(data);

      console.log("QR RESPONSE:", data);
    } catch (err: any) {
      console.error(err);

      setQrResult({
        success: false,
        message: err?.response?.data?.detail || "QR detection failed",
      });
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Reader Stream</h1>

      <div className="overflow-hidden rounded-2xl border border-border bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full max-h-[700px] object-contain"
        />
      </div>

      {/* QR BUTTON */}
      <div>
        <button
          onClick={handleQrDetect}
          disabled={loadingQR}
          className="rounded-xl bg-gradient-to-r from-[#29C5E8] to-[#2F80ED] px-6 py-3 text-[#0E2038] text-[20px] font-[700]"
        >
          {loadingQR ? "Processing..." : "Detect QR"}
        </button>
      </div>

      {/* QR RESULT */}
      {qrResult && (
        <div
          className={`p-4 rounded-xl ${
            qrResult.success !== false
              ? "bg-emerald-500/10 text-ok border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          <p className="font-medium">
            {qrResult.message || "QR scanned successfully"}
          </p>
          {qrResult.data && (
            <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(qrResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
