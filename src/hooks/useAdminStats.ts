"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import { presetRange } from "@/components/admin/format";
import type { DateRange, Stats } from "@/lib/ApiClient";

export function useAdminStats() {
  const api = useApi();
  const [range, setRange] = useState<DateRange>(() => presetRange(30));
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await api.admin.stats(range));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [api, range]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, range, setRange, loading, error, reload };
}
