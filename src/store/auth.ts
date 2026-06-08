"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  fatherName: string | null;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthState {
  accessToken: string | null;
  user: SessionUser | null;
  set: (data: { accessToken: string; user: SessionUser }) => void;
  setToken: (accessToken: string) => void;
  clear: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      set: ({ accessToken, user }) => set({ accessToken, user }),
      setToken: (accessToken) => set({ accessToken }),
      clear: () => set({ accessToken: null, user: null }),
    }),
    { name: "ab-auth" },
  ),
);
