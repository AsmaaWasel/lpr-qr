"use client";

import { useMemo, useState, useEffect } from "react";

import CameraTable from "./CameraTable";

import {
  SectionCard,
  StatRow,
  PillTabs,
  Toolbar,
  Pagination,
} from "@/shared/ui/voom";

import { Camera } from "@/modules/types/camera";
import { getCameras } from "@/services/cameras";

const PAGE_SIZE = 10;

const LPR_TABS = [
  { label: "Real Time Gates", href: "/dashboard/lpr/real-time" },
  { label: "Gates", href: "/dashboard/lpr/gates" },
  { label: "Cameras", href: "/dashboard/lpr/cameras" },
  { label: "Plates", href: "/dashboard/lpr/plates" },
];

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // FETCH CAMERAS
  // =========================
  const fetchCameras = async () => {
    try {
      setLoading(true);
      const data = await getCameras();
      setCameras(data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredCameras = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return cameras;

    return cameras.filter(
      (camera) =>
        camera.location?.toLowerCase().includes(query) ||
        camera.ip_address?.toLowerCase().includes(query) ||
        camera.gate_id?.toString().includes(query) ||
        camera.url?.toLowerCase().includes(query),
    );
  }, [cameras, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCameras.length / PAGE_SIZE));

  const pagedCameras = useMemo(
    () =>
      filteredCameras.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filteredCameras, currentPage],
  );

  // =========================
  // STATS
  // =========================
  const stats = useMemo(
    () => [
      { label: "Total Cameras", value: cameras.length },
      {
        label: "Active",
        value: cameras.filter(
          (c) => c.gate_id !== undefined && c.gate_id !== null,
        ).length,
      },
      {
        label: "RTSP",
        value: cameras.filter((c) => c.port === 554).length,
      },
      { label: "HTTP", value: cameras.filter((c) => c.port === 8080).length },
    ],
    [cameras],
  );

  // =========================
  // CRUD OPERATIONS
  // =========================
  const handleAdd = () => {
    setEditingCamera(null);
    setModalOpen(true);
  };

  const handleEdit = () => {
    const camera = cameras.find((item) => item.id === selectedCamera);
    if (!camera) return;

    setEditingCamera(camera);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedCamera) return;
    if (!window.confirm("Are you sure you want to delete this camera?")) return;

    setCameras((prev) => prev.filter((camera) => camera.id !== selectedCamera));
    setSelectedCamera(null);
  };

  const handleSave = (data: Omit<Camera, "id">) => {
    if (editingCamera) {
      setCameras((prev) =>
        prev.map((camera) =>
          camera.id === editingCamera.id ? { ...camera, ...data } : camera,
        ),
      );
      setSelectedCamera(null);
      return;
    }

    setCameras((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
        ...data,
      },
    ]);
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/cameras" />

      <StatRow items={stats} />

      <SectionCard>
        <Toolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by location, IP, gate ID or URL..."
          addLabel="Add Camera"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hasSelected={selectedCamera !== null}
        />

        <CameraTable
          data={pagedCameras}
          selectedId={selectedCamera}
          onSelect={(id) =>
            setSelectedCamera(selectedCamera === id ? null : id)
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCameras.length}
          itemLabel="cameras"
          onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
        />
      </SectionCard>

      <CameraModal
        open={modalOpen}
        camera={editingCamera}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
