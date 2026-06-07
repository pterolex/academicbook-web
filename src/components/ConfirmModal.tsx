"use client";
import { useEffect } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Видалити",
  cancelLabel = "Скасувати",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !busy && onCancel()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border p-4 space-y-3"
        style={{
          background: "var(--ab-bg, #fff)",
          borderColor: "var(--ab-border)",
          maxWidth: 380,
          width: "100%",
        }}
      >
        <h2 className="text-lg">{title}</h2>
        {message && (
          <p className="text-sm text-[color:var(--ab-muted)]">{message}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="border px-3 py-1 text-sm"
            style={{ borderColor: "var(--ab-border)", cursor: busy ? "not-allowed" : "pointer" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-3 py-1 text-sm"
            style={{
              background: "#c0392b",
              color: "#fff",
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.5 : 1,
            }}
          >
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
