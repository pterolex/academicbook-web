"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type SessionUser } from "@/store/auth";

// Client-side route guard. Redirects to /login when signed out, and to "/" when
// a required role is missing. Returns the user (or null while redirecting) so
// callers can short-circuit rendering with `if (!user) return null`.
export function useRequireAuth(opts?: {
  role?: SessionUser["role"];
}): SessionUser | null {
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const role = opts?.role;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (role && user.role !== role) {
      router.replace("/");
    }
  }, [user, router, role]);

  if (!user || (role && user.role !== role)) return null;
  return user;
}
