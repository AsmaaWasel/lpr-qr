// services/upload.ts

import api from "./api";

export const uploadMapImage = async (
  file: File,
): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "map_background");

    const response = await api.post("/settings/features", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading map image:", error);
    throw error;
  }
};

export const deleteMapImage = async (imageUrl: string): Promise<void> => {
  try {
    await api.delete("/settings/features", {
      data: { imageUrl },
    });
  } catch (error) {
    console.error("Error deleting map image:", error);
    throw error;
  }
};

export const getMapImage = async (): Promise<{ imageUrl: string | null }> => {
  try {
    const response = await api.get("/settings/features");
    return response.data;
  } catch (error) {
    console.error("Error fetching map image:", error);
    return { imageUrl: null };
  }
};
