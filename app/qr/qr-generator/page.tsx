"use client";

import { useState } from "react";

import { Share2, QrCode, Loader2, Copy, Check, RotateCcw } from "lucide-react";

import { generateQR } from "@/services/qr";

type QRResponse = {
  qr_image: string;
  max_uses: number;
};

export default function QRPage() {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [maxUses, setMaxUses] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // =========================
  // GENERATE QR
  // =========================
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await generateQR({
        max_uses: maxUses,
      });

      setQrData(data);
    } catch (err) {
      console.log(err);
      setError("Please try again later. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const handleReset = () => {
    setQrData(null);
    setError(null);
    setCopied(false);
  };

  // =========================
  // SHARE TO WHATSAPP
  // =========================
  const handleShare = () => {
    if (!qrData) return;

    const imageUrl = `http://127.0.0.1:8000/${qrData.qr_image}`;

    const message = `SMARTGATE QR Access Code\n\n${imageUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // =========================
  // COPY LINK
  // =========================
  const handleCopy = async () => {
    if (!qrData) return;

    const imageUrl = `http://127.0.0.1:8000/${qrData.qr_image}`;

    try {
      await navigator.clipboard.writeText(imageUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MAX USES
  // =========================
  const handleMaxUsesChange = (value: number) => {
    if (Number.isNaN(value)) return;

    setMaxUses(Math.max(1, value));
  };

  return (
    <div className="space-y-6 pb-28">
      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="bg-danger-soft border border-red-500/30 text-danger rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-6 items-start">
        {/* =========================
            LEFT SIDE - INFO / TABLE
        ========================= */}
        <div className="space-y-4">
          {/* MODULE */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted-foreground text-sm">Module</p>

            <h2 className="text-foreground text-xl font-semibold mt-2">
              QR Security
            </h2>
          </div>

          {/* FEATURE */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted-foreground text-sm">Feature</p>

            <h2 className="text-foreground text-xl font-semibold mt-2">
              QR Generation
            </h2>
          </div>

          {/* MAX USES */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted-foreground text-sm mb-3">Max Uses</p>

            <div className="flex items-center gap-3">
              {/* MINUS */}
              <button
                onClick={() => handleMaxUsesChange(maxUses - 1)}
                disabled={maxUses <= 1}
                className="
                  w-10 h-10
                  rounded-lg
                  bg-secondary
                  text-foreground
                  hover:bg-slate-700
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                "
              >
                -
              </button>

              {/* INPUT */}
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => handleMaxUsesChange(Number(e.target.value))}
                className="
                  flex-1
                  bg-[#a0acbd]
                  border
                  border-border
                  rounded-xl
                  px-4
                  py-2
                  text-center
                  text-foreground
                  outline-none
                  focus:border-brand
                  transition
                "
              />

              {/* PLUS */}
              <button
                onClick={() => handleMaxUsesChange(maxUses + 1)}
                className="
                  w-10 h-10
                  rounded-lg
                  bg-brand
                  text-foreground
                  hover:bg-brand
                  transition
                "
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE - QR
        ========================= */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {!qrData ? (
            /* =========================
               EMPTY / LOADING
            ========================= */
            <div className="h-[500px] flex flex-col items-center justify-center">
              {loading ? (
                <>
                  <Loader2 size={80} className="text-brand mb-4 animate-spin" />

                  <h2 className="text-foreground text-xl font-semibold">
                    Generating QR...
                  </h2>

                  <p className="text-muted-foreground mt-2">
                    Please wait a moment
                  </p>
                </>
              ) : (
                <>
                  <QrCode size={80} className="text-foreground mb-4" />

                  <h2 className="text-foreground text-xl font-semibold">
                    No QR Generated
                  </h2>

                  <p className="text-muted-foreground mt-2">
                    Generate a new QR code
                  </p>
                </>
              )}
            </div>
          ) : (
            /* =========================
               GENERATED QR
            ========================= */
            <div className="flex flex-col items-center justify-center">
              {/* QR IMAGE */}
              <div className="bg-card p-5 rounded-2xl shadow-2xl">
                <img
                  src={`http://127.0.0.1:8000/${qrData.qr_image}`}
                  alt="QR"
                  className="
                    w-[320px]
                    h-[320px]
                    object-contain
                  "
                />
              </div>

              {/* GENERATED MAX USES */}
              <div
                className="
                mt-6
                bg-card
                border
                border-border
                rounded-2xl
                px-6
                py-4
              "
              >
                <p
                  className="
                  text-muted-foreground
                  text-sm
                  text-center
                "
                >
                  Max Uses
                </p>

                <h2
                  className="
                  text-foreground
                  text-4xl
                  font-bold
                  mt-2
                  text-center
                "
                >
                  {qrData.max_uses}
                </h2>
              </div>

              {/* ACTIONS */}
              <div
                className="
                mt-6
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
              "
              >
                {/* WHATSAPP */}
                <button
                  onClick={handleShare}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-green-500
                    hover:bg-green-400
                    text-foreground
                    px-5
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  <Share2 size={18} />
                  Share on WhatsApp
                </button>

                {/* COPY */}
                <button
                  onClick={handleCopy}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-secondary
                    hover:bg-slate-700
                    text-foreground
                    px-5
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}

                  {copied ? "Copied!" : "Copy Link"}
                </button>

                {/* NEW QR */}
                <button
                  onClick={handleReset}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-transparent
                    border
                    border-border
                    hover:bg-card
                    text-muted-foreground
                    px-5
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  <RotateCcw size={18} />
                  New QR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================
          FLOATING GENERATE BUTTON
      ========================= */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="
          fixed
          bottom-6
          left-[295px]
          z-50
          flex
          items-center
          justify-center
          gap-2
          bg-brand
          hover:bg-brand
          active:bg-brand-strong
          disabled:opacity-60
          disabled:cursor-not-allowed
          text-foreground
          px-6
          py-4
          rounded-2xl
          shadow-2xl
          shadow-sky-500/30
          transition
        "
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode size={18} />
            Generate QR
          </>
        )}
      </button>
    </div>
  );
}
