"use client";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { AdminCategory } from "@/lib/ApiClient";

export function useAdminCategories() {
  const api = useApi();
  const [rows, setRows] = useState<AdminCategory[]>([]);

  useEffect(() => {
    api.admin.categories()
      .then(setRows)
      .catch(() => setRows([]));
  }, [api]);

  return { rows };
}
