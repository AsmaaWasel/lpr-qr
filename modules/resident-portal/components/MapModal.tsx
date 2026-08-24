"use client";

import {
  HiOutlineMap,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineTrash,
} from "react-icons/hi";

type Props = {
  open: boolean;
  onClose: () => void;

  mapImage: string | null;

  uploadingImage: boolean;
  uploadError: string | null;

  fileInputRef: React.RefObject<HTMLInputElement | null>;

  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onRemove: () => void;
};

export default function MapModal({
  open,
  onClose,
  mapImage,
  uploadingImage,
  uploadError,
  fileInputRef,
  onUpload,
  onRemove,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <HiOutlineMap className="w-5 h-5 text-brand" />
              Map
            </h2>

            <p className="text-muted-foreground text-xs mt-1">
              Upload the background map
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close map"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* LABEL */}
          <label className="text-foreground text-sm font-semibold flex items-center gap-2">
            <HiOutlinePhotograph className="w-4 h-4" />
            Map Background
          </label>

          {/* FILE INPUT */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onUpload}
            disabled={uploadingImage}
            className="w-full text-muted-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-brand cursor-pointer"
          />

          {/* UPLOADING */}
          {uploadingImage && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />

                <p className="text-brand text-sm">Uploading image...</p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {uploadError && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <p className="text-rose-400 text-sm">{uploadError}</p>
            </div>
          )}

          {/* PREVIEW */}
          {mapImage && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
              <img
                src={mapImage}
                alt="Map preview"
                className="w-full h-full object-cover"
              />

              <button
                onClick={onRemove}
                disabled={uploadingImage}
                className="absolute top-2 right-2 p-2 bg-rose-500/80 hover:bg-danger rounded-lg transition-colors disabled:opacity-50"
                aria-label="Remove map"
              >
                <HiOutlineTrash className="w-4 h-4 text-foreground" />
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!mapImage && !uploadingImage && (
            <div className="h-32 rounded-xl border border-dashed border-border flex items-center justify-center">
              <div className="text-center">
                <HiOutlineMap className="w-8 h-8 text-foreground mx-auto mb-2" />

                <p className="text-muted-foreground text-sm">No map image uploaded</p>
              </div>
            </div>
          )}

          {/* DONE */}
          <button
            onClick={onClose}
            className="w-full bg-blue-500/20 text-brand border border-blue-500/30 py-3 rounded-xl hover:bg-blue-500/30 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
