"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useParams } from "next/navigation";

import api from "@/services/api";

const STREAM_URL = "http://localhost:8888/cam1/index.m3u8";
const WS_URL = "ws://localhost:8000/ws";

type RecognitionResult = {
  message?: string;
  plate_number?: string;
  image_url?: string;
  processing_ms?: number;
  [key: string]: any;
};

type AccessEvent = {
  event: string;
  request_id?: string | null;
  gate_id?: number | null;
  camera_id?: number | null;

  data?: {
    plate_number?: string;
    image_url?: string;
    processing_ms?: number;
    message?: string;
    reason?: string;
    [key: string]: any;
  };
};

export default function CameraStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { id } = useParams();
  const cameraId = Number(id);

  // =========================
  // LPR STATE
  // =========================

  const [loadingLPR, setLoadingLPR] = useState(false);

  const [recognitionResult, setRecognitionResult] =
    useState<RecognitionResult | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [errorReason, setErrorReason] = useState<string | null>(null);

  // =========================
  // WEBSOCKET STATE
  // =========================

  const [wsConnected, setWsConnected] = useState(false);

  const [requestId, setRequestId] = useState<string | null>(null);

  const [accessStatus, setAccessStatus] = useState<string>("idle");

  const [lastEvent, setLastEvent] = useState<AccessEvent | null>(null);

  // =========================
  // HLS STREAM
  // =========================

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

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS ERROR:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // =========================
  // WEBSOCKET
  // =========================

  useEffect(() => {
    console.log("Connecting WebSocket:", WS_URL);

    const socket = new WebSocket(WS_URL);

    wsRef.current = socket;

    // =========================
    // OPEN
    // =========================

    socket.onopen = () => {
      console.log("WebSocket connected");

      setWsConnected(true);
    };

    // =========================
    // MESSAGE
    // =========================

    socket.onmessage = (message) => {
      try {
        const event: AccessEvent = JSON.parse(message.data);

        console.log("=================================");
        console.log("WEBSOCKET EVENT:", event);
        console.log("EVENT:", event.event);
        console.log("REQUEST ID:", event.request_id);
        console.log("DATA:", event.data);
        console.log("REASON:", event.data?.reason);
        console.log("MESSAGE:", event.data?.message);
        console.log("=================================");

        setLastEvent(event);

        // =========================
        // CONNECTED
        // =========================

        if (event.event === "CONNECTED") {
          return;
        }

        // =========================
        // REQUEST ID
        // =========================

        if (event.request_id) {
          setRequestId(event.request_id);
        }

        // =========================
        // LOOP TRIGGERED
        // =========================

        if (event.event === "LOOP_TRIGGERED") {
          setAccessStatus("LOOP_TRIGGERED");
          setLoadingLPR(true);

          return;
        }

        // =========================
        // LPR PROCESSING
        // =========================

        if (event.event === "LPR_PROCESSING") {
          setAccessStatus("LPR_PROCESSING");
          setLoadingLPR(true);

          return;
        }

        // =========================
        // PLATE DETECTED
        // =========================

        if (event.event === "PLATE_DETECTED") {
          const plateNumber = event.data?.plate_number;
          const imageUrl = event.data?.image_url;
          const processingMs = event.data?.processing_ms;

          setRecognitionResult({
            message:
              event.data?.message || "License plate detected successfully.",
            plate_number: plateNumber,
            image_url: imageUrl,
            processing_ms: processingMs,
          });

          setErrorMessage(null);
          setErrorReason(null);

          setAccessStatus("PLATE_DETECTED");

          setLoadingLPR(false);

          return;
        }

        // =========================
        // ACCESS GRANTED
        // =========================

        if (event.event === "ACCESS_GRANTED") {
          setAccessStatus("ACCESS_GRANTED");

          setErrorMessage(null);
          setErrorReason(null);

          setLoadingLPR(false);

          return;
        }

        // =========================
        // QR REQUIRED
        // =========================

        if (event.event === "QR_REQUIRED") {
          setAccessStatus("QR_REQUIRED");

          setLoadingLPR(false);

          setErrorReason(event.data?.reason || null);

          setRecognitionResult((previous) => ({
            ...(previous || {}),
            message:
              event.data?.message || "Access requires QR code verification.",
          }));

          return;
        }

        // =========================
        // QR PROCESSING
        // =========================

        if (event.event === "QR_PROCESSING") {
          setAccessStatus("QR_PROCESSING");

          setLoadingLPR(true);

          return;
        }

        // =========================
        // QR DETECTED
        // =========================

        if (event.event === "QR_DETECTED") {
          setAccessStatus("QR_DETECTED");

          setErrorMessage(null);
          setErrorReason(null);

          setLoadingLPR(false);

          return;
        }

        // =========================
        // QR INVALID
        // =========================

        if (event.event === "QR_INVALID") {
          const reason = event.data?.reason;
          const message = event.data?.message;

          setAccessStatus("QR_INVALID");

          setLoadingLPR(false);

          setErrorReason(reason || null);

          setErrorMessage(message || "QR code is invalid.");

          return;
        }

        // =========================
        // ACCESS DENIED
        // =========================

        if (event.event === "ACCESS_DENIED") {
          const reason = event.data?.reason;
          const message = event.data?.message;

          console.error("ACCESS DENIED");
          console.error("Reason:", reason);
          console.error("Message:", message);

          setAccessStatus("ACCESS_DENIED");

          setLoadingLPR(false);

          // Save backend reason
          setErrorReason(reason || null);

          // Save backend message
          setErrorMessage(message || "Access denied.");

          return;
        }

        // =========================
        // GATE OPENING
        // =========================

        if (event.event === "GATE_OPENING") {
          setAccessStatus("GATE_OPENING");

          return;
        }

        // =========================
        // GATE OPENED
        // =========================

        if (event.event === "GATE_OPENED") {
          setAccessStatus("GATE_OPENED");

          setLoadingLPR(false);

          return;
        }

        // =========================
        // GATE CLOSED
        // =========================

        if (event.event === "GATE_CLOSED") {
          setAccessStatus("GATE_CLOSED");

          return;
        }

        // =========================
        // ERROR
        // =========================

        if (event.event === "ERROR") {
          const reason = event.data?.reason;
          const message = event.data?.message;

          setAccessStatus("ERROR");

          setLoadingLPR(false);

          setErrorReason(reason || null);

          setErrorMessage(message || "Access cycle failed.");

          return;
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    // =========================
    // ERROR
    // =========================

    socket.onerror = (error) => {
      console.error("========== WEBSOCKET ERROR ==========");

      console.error("URL:", WS_URL);
      console.error("ERROR:", error);
      console.error("READY STATE:", socket.readyState);

      console.error("======================================");

      setWsConnected(false);
    };

    // =========================
    // CLOSE
    // =========================

    socket.onclose = (event) => {
      console.error("========== WEBSOCKET CLOSED ==========");

      console.error("Code:", event.code);
      console.error("Reason:", event.reason);
      console.error("Was Clean:", event.wasClean);

      console.error("=======================================");

      setWsConnected(false);

      if (wsRef.current === socket) {
        wsRef.current = null;
      }
    };

    // =========================
    // CLEANUP
    // =========================

    return () => {
      socket.close();

      if (wsRef.current === socket) {
        wsRef.current = null;
      }
    };
  }, []);

  // =========================
  // CAPTURE FRAME
  // =========================

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return null;
    }

    if (!video.videoWidth || !video.videoHeight) {
      console.error("Video frame is not ready");

      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

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

      setErrorMessage(null);
      setErrorReason(null);

      setRecognitionResult(null);

      setRequestId(null);

      setLastEvent(null);

      setAccessStatus("STARTING");

      // =========================
      // CAPTURE CURRENT FRAME
      // =========================

      captureFrame();

      // =========================
      // START ACCESS CYCLE
      // =========================

      const { data } = await api.post(`/loop-event/${cameraId}`);

      console.log("ACCESS CYCLE RESPONSE:", data);

      // =========================
      // REQUEST ID
      // =========================

      if (data?.request_id) {
        setRequestId(data.request_id);
      }

      // =========================
      // IMPORTANT
      // =========================
      //
      // POST فقط يبدأ Access Cycle.
      //
      // النتيجة الحقيقية تأتي من WebSocket.
      //
      // =========================

      setAccessStatus("WAITING_FOR_LPR");
    } catch (err: any) {
      console.error("LPR ERROR:", err);

      console.error("STATUS:", err?.response?.status);

      console.error("DATA:", err?.response?.data);

      console.error("MESSAGE:", err?.message);

      const backendError =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "LPR Detection failed";

      setErrorMessage(backendError);

      setErrorReason(err?.response?.data?.reason || null);

      setAccessStatus("ERROR");

      setLoadingLPR(false);
    }
  };

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = () => {
    switch (accessStatus) {
      case "STARTING":
        return "Starting access cycle...";

      case "WAITING_FOR_LPR":
        return "Waiting for LPR...";

      case "LOOP_TRIGGERED":
        return "Loop triggered";

      case "LPR_PROCESSING":
        return "Processing license plate...";

      case "PLATE_DETECTED":
        return "Plate detected";

      case "ACCESS_GRANTED":
        return "Access granted";

      case "QR_REQUIRED":
        return "QR verification required";

      case "QR_PROCESSING":
        return "Processing QR...";

      case "QR_DETECTED":
        return "QR detected";

      case "QR_INVALID":
        return "Invalid QR";

      case "ACCESS_DENIED":
        return "Access denied";

      case "GATE_OPENING":
        return "Gate opening";

      case "GATE_OPENED":
        return "Gate opened";

      case "GATE_CLOSED":
        return "Gate closed";

      case "ERROR":
        return "Error";

      default:
        return "Ready";
    }
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusClass = () => {
    if (
      accessStatus === "ACCESS_GRANTED" ||
      accessStatus === "GATE_OPENED" ||
      accessStatus === "QR_DETECTED"
    ) {
      return "bg-emerald-500/10 text-emerald-400";
    }

    if (
      accessStatus === "ACCESS_DENIED" ||
      accessStatus === "QR_INVALID" ||
      accessStatus === "ERROR"
    ) {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-blue-500/10 text-blue-400";
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-6 p-6">
      {/* =========================
          PAGE TITLE
      ========================= */}

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Camera Stream
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor the live camera stream and detect license plates.
            </p>
          </div>

          {/* WebSocket Status */}

          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              wsConnected
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                wsConnected ? "bg-emerald-400" : "bg-red-400"
              }`}
            />

            {wsConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
          </div>
        </div>
      </div>

      {/* =========================
          ACCESS CYCLE STATUS
      ========================= */}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Access Cycle
            </p>

            <h2 className="mt-1 text-xl font-bold text-foreground">
              {getStatusLabel()}
            </h2>
          </div>

          <div
            className={`rounded-xl px-4 py-2 text-sm font-bold ${getStatusClass()}`}
          >
            {accessStatus}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {/* Camera */}

          <div className="rounded-xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">Camera ID</p>

            <p className="mt-1 text-lg font-bold text-foreground">{cameraId}</p>
          </div>

          {/* Request ID */}

          <div className="rounded-xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">Request ID</p>

            <p className="mt-1 break-all text-sm font-semibold text-foreground">
              {requestId || "—"}
            </p>
          </div>

          {/* Last Event */}

          <div className="rounded-xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">
              Last WebSocket Event
            </p>

            <p className="mt-1 text-lg font-bold text-foreground">
              {lastEvent?.event || "—"}
            </p>
          </div>
        </div>

        {/* =========================
            LAST EVENT REASON
        ========================= */}

        {lastEvent?.data?.reason && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Event Reason
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-amber-400">
              {lastEvent.data.reason}
            </p>
          </div>
        )}
      </div>

      {/* =========================
          CAMERA
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="max-h-[700px] w-full object-contain"
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* =========================
          LPR BUTTON
      ========================= */}

      <div>
        <button
          type="button"
          onClick={handleDetect}
          disabled={loadingLPR}
          className="
            rounded-xl
            bg-gradient-to-r
            from-[#29C5E8]
            to-[#2F80ED]
            px-6
            py-3
            text-[20px]
            font-[700]
            text-[#0E2038]
            shadow-sm
            transition-all
            duration-200
            hover:scale-[1.02]
            hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loadingLPR ? "Processing..." : "Detect LPR"}
        </button>
      </div>

      {/* =========================
          ERROR RESULT
      ========================= */}

      {errorMessage && (
        <div
          className="
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            p-5
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-500/15
              "
            >
              <span className="text-xl font-bold text-red-400">!</span>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-red-400">Access Denied</h3>

              <p className="mt-1 text-sm leading-6 text-red-300/90">
                {errorMessage}
              </p>

              {/* =========================
                  FAILURE REASON
              ========================= */}

              {errorReason && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-3">
                  <p className="text-xs font-medium text-red-300/70">
                    Failure Reason
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-red-300">
                    {errorReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          SUCCESS RESULT
      ========================= */}

      {recognitionResult && !errorMessage && (
        <div
          className="
            rounded-2xl
            border
            border-emerald-500/30
            bg-emerald-500/10
            p-5
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-500/15
              "
            >
              <span className="text-xl font-bold text-emerald-400">✓</span>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-emerald-400">
                LPR Detection Successful
              </h3>

              <p className="mt-1 text-sm leading-6 text-foreground/80">
                {recognitionResult.message ||
                  "License plate detected successfully."}
              </p>

              {/* =========================
                  PLATE NUMBER
              ========================= */}

              {recognitionResult.plate_number && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-border
                    bg-background/60
                    px-4
                    py-3
                  "
                >
                  <span className="text-xs text-muted-foreground">
                    License Plate
                  </span>

                  <div
                    className="
                      mt-1
                      text-xl
                      font-bold
                      tracking-wider
                      text-foreground
                    "
                  >
                    {recognitionResult.plate_number}
                  </div>
                </div>
              )}

              {/* =========================
                  PROCESSING TIME
              ========================= */}

              {recognitionResult.processing_ms !== undefined && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Processing time:{" "}
                  <span className="font-semibold text-foreground">
                    {recognitionResult.processing_ms} ms
                  </span>
                </div>
              )}

              {/* =========================
                  IMAGE URL
              ========================= */}

              {recognitionResult.image_url && (
                <div className="mt-4">
                  <img
                    src={recognitionResult.image_url}
                    alt="Detected license plate"
                    className="max-h-80 rounded-xl border border-border object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          CAPTURED IMAGE
      ========================= */}

      {capturedImage && false && (
        <div className="rounded-2xl border border-border p-4">
          <img
            src={capturedImage}
            alt="Captured camera frame"
            className="w-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
