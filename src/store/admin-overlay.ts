"use client";
import { create } from "zustand";

// Drupal-7-style admin overlay. Holds the admin path currently shown in the
// iframe overlay (null = closed). The toolbar opens it; the overlay component
// keeps it in sync with the URL fragment (#overlay=/admin/...).
interface AdminOverlayState {
  close: () => void;
  open: (path: string) => void;
  path: string | null;
}

export const useAdminOverlay = create<AdminOverlayState>((set) => ({
  path: null,
  open: (path) => set({ path }),
  close: () => set({ path: null }),
}));
