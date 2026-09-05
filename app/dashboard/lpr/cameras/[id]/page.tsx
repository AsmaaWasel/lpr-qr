"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import api from "@/services/api";
import { useParams } from "next/navigation";

const STREAM_URL = "http://localhost:8888/cam1/index.m3u8";

export default function CameraStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { id } = useParams();

  const [loadingLPR, setLoadingLPR] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<any>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg");

    setCapturedImage(image);

    return image;
  };

  // =========================
  // LPR DETECT
  // =========================
  const handleDetect = async () => {
    try {
      setLoadingLPR(true);

      captureFrame();

      const { data } = await api.post(`/loop-event/${id}`);

      setRecognitionResult(data);

      console.log("LPR RESPONSE:", data);
    } catch (err: any) {
      console.error("LPR ERROR:", err);

      console.error("STATUS:", err?.response?.status);
      console.error("DATA:", err?.response?.data);
      console.error("MESSAGE:", err?.message);

      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "LPR Detection failed",
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Camera Stream</h1>

      <div className="overflow-hidden rounded-2xl border border-border bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full max-h-[700px] object-contain"
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* LPR BUTTON */}
      <div>
        <button
          onClick={handleDetect}
          disabled={loadingLPR}
          className="rounded-xl bg-gradient-to-r from-[#29C5E8] to-[#2F80ED] px-6 py-3 text-[#0E2038] text-[20px] font-[700]"
        >
          {loadingLPR ? "Processing..." : "Detect LPR"}
        </button>
      </div>

      {/* RESULT */}
      {recognitionResult && (
        <div className="text-green-400">{recognitionResult.message}</div>
      )}
    </div>
  );
}
