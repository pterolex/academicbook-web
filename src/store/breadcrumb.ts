"use client";
import { create } from "zustand";

interface BreadcrumbState {
  title: string | null;
  setTitle: (title: string) => void;
  clearTitle: () => void;
}

export const useBreadcrumb = create<BreadcrumbState>()((set) => ({
  title: null,
  setTitle: (title) => set({ title }),
  clearTitle: () => set({ title: null }),
}));
