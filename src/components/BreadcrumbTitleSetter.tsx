"use client";
import { useEffect } from "react";
import { useBreadcrumb } from "@/store/breadcrumb";

export function BreadcrumbTitleSetter({ title }: { title: string }) {
  const setTitle = useBreadcrumb((s) => s.setTitle);
  const clearTitle = useBreadcrumb((s) => s.clearTitle);

  useEffect(() => {
    setTitle(title);
    return () => clearTitle();
  }, [title, setTitle, clearTitle]);

  return null;
}
