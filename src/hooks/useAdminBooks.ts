"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { AdminBook } from "@/lib/ApiClient";

export function useAdminBooks() {
  const api = useApi();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AdminBook[]>([]);

  const search = useCallback(() => {
    api.admin
      .books(q || undefined)
      .then(setRows)
      .catch(() => setRows([]));
  }, [api, q]);

  // Initial load and reload when the token-bound client changes.
  useEffect(() => {
    api.admin
      .books()
      .then(setRows)
      .catch(() => setRows([]));
  }, [api]);

  return { q, setQ, rows, search };
}
