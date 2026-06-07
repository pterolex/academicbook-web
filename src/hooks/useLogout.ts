"use client";
import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/store/auth";

// Logs out: clears the server refresh cookie via POST /auth/logout, then drops
// local auth state. The server call is best-effort — local state is cleared
// even if it fails (e.g. offline), so the user is never stuck logged in.
export function useLogout(): () => Promise<void> {
  const api = useApi();
  const clear = useAuth((s) => s.clear);
  return useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore — clear local state regardless
    }
    clear();
  }, [api, clear]);
}
