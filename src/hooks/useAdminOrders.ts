"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { AdminOrder, OrderStatus } from "@/lib/ApiClient";

export function useAdminOrders() {
  const api = useApi();
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = useCallback(() => {
    api.admin
      .orders()
      .then(setRows)
      .catch(() => setRows([]));
  }, [api]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      setBusy(id);
      try {
        await api.admin.setOrderStatus(id, status);
        reload();
      } finally {
        setBusy(null);
      }
    },
    [api, reload],
  );

  return { rows, busy, setStatus };
}
