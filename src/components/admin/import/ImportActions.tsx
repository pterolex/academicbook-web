export function ImportActions({
  busy,
  canRun,
  canCommit,
  onRun,
}: {
  busy: boolean;
  canRun: boolean;
  canCommit: boolean;
  onRun: (dryRun: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        disabled={busy || !canRun}
        onClick={() => onRun(true)}
        className="px-4 py-2 border disabled:opacity-50"
        style={{ borderColor: "var(--ab-border)" }}
      >
        Пробний запуск
      </button>
      <button
        disabled={busy || !canCommit}
        onClick={() => onRun(false)}
        className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
        style={{ background: "var(--ab-accent)" }}
      >
        Підтвердити імпорт
      </button>
    </div>
  );
}
