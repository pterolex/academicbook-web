"use client";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";
import { useAuth } from "@/store/auth";
import type { ImportHistoryRow, ImportReport } from "@/lib/ApiClient";

export type ImportMode = "url" | "file";

export function useImport() {
  const api = useApi();
  const token = useAuth((s) => s.accessToken);

  const [mode, setMode] = useState<ImportMode>("url");
  const [file, setFile] = useState<File | null>(null);
  const [defaultUrl, setDefaultUrl] = useState("");
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ImportHistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      setHistory(await api.admin.importHistory(20));
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (!token) return;
    api.admin
      .importSource()
      .then((d) => {
        setDefaultUrl(d.url);
        setUrl(d.url);
      })
      .catch(() => {});
    loadHistory();
  }, [api, token, loadHistory]);

  const run = useCallback(
    async (dryRun: boolean) => {
      if (mode === "file" && !file) return;
      setBusy(true);
      setError(null);
      try {
        const r =
          mode === "file"
            ? await api.admin.importFile(file as File, dryRun)
            : await api.admin.importUrl(
                url && url !== defaultUrl ? url : undefined,
                dryRun,
              );
        setReport(r);
        if (r.committed) loadHistory();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [api, mode, file, url, defaultUrl, loadHistory],
  );

  const changeMode = (m: ImportMode) => {
    setMode(m);
    setReport(null);
  };

  return {
    mode,
    changeMode,
    file,
    setFile: (f: File | null) => {
      setFile(f);
      setReport(null);
    },
    url,
    setUrl: (u: string) => {
      setUrl(u);
      setReport(null);
    },
    defaultUrl,
    report,
    busy,
    error,
    history,
    historyLoading,
    loadHistory,
    run,
  };
}
