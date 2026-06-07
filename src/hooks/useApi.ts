"use client";
import { useMemo } from "react";
import { ApiClient } from "@/lib/ApiClient";
import { API_URL } from "@/lib/env";
import { useAuth } from "@/store/auth";

// Returns an ApiClient bound to the current bearer token. Re-instantiated only
// when the token changes, so hooks can depend on it safely. On a 401 the client
// silently refreshes via the httpOnly cookie and persists the new token; if the
// refresh fails the session is cleared.
export function useApi(): ApiClient {
  const token = useAuth((s) => s.accessToken);
  return useMemo(
    () =>
      new ApiClient({
        baseUrl: API_URL,
        token,
        onTokenRefreshed: (t) => useAuth.getState().setToken(t),
        onAuthExpired: () => useAuth.getState().clear(),
      }),
    [token],
  );
}
