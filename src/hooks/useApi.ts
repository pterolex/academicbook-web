"use client";
import { useMemo } from "react";
import { ApiClient } from "@/lib/ApiClient";
import { API_URL } from "@/lib/env";
import { useAuth } from "@/store/auth";

// Returns an ApiClient bound to the current bearer token. Re-instantiated only
// when the token changes, so hooks can depend on it safely.
export function useApi(): ApiClient {
  const token = useAuth((s) => s.accessToken);
  return useMemo(() => new ApiClient({ baseUrl: API_URL, token }), [token]);
}
