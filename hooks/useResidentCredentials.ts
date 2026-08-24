import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { updateResidentCredentials } from "@/services/owner";

export function useResidentCredentials() {
  const [loading, setLoading] = useState(false);

  
  const updateCredentials = async (
    residentId: number,
    email: string,
    password?: string,
  ) => {
    try {
      setLoading(true);

      await updateResidentCredentials(residentId, {
        email,
        password,
      });

      toast.success("Credentials updated successfully");

      return true;
    } catch (err) {
      let msg = "Failed to update credentials";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.detail || msg;
      }

      toast.error(msg);

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateCredentials,
  };
}
