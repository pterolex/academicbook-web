"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { AdminBook } from "@/lib/ApiClient";

export function useAdminBooks() {
  const api = useApi();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AdminBook[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const load = useCallback(
    (query: string, p: number) => {
      api.admin
        .books(query || undefined, p)
        .then((res) => {
          setRows(res.items);
          setTotal(res.total);
          setPage(res.page);
          setPageSize(res.pageSize);
        })
        .catch(() => {
          setRows([]);
          setTotal(0);
        });
    },
    [api],
  );

  // Search resets to first page.
  const search = useCallback(() => load(q, 1), [load, q]);

  const goToPage = useCallback((p: number) => load(q, p), [load, q]);

  // Initial load and reload when the token-bound client changes.
  useEffect(() => {
    load("", 1);
  }, [load]);

  const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  return { q, setQ, rows, search, page, pageCount, total, goToPage };
}
