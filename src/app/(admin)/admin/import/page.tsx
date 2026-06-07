"use client";
import { useImport } from "@/hooks/useImport";
import { ImportSourcePicker } from "@/components/admin/import/ImportSourcePicker";
import { ImportActions } from "@/components/admin/import/ImportActions";
import { ImportReportView } from "@/components/admin/import/ImportReportView";
import { ImportHistoryTable } from "@/components/admin/import/ImportHistoryTable";

export default function AdminImport() {
  const {
    mode,
    changeMode,
    file,
    setFile,
    url,
    setUrl,
    defaultUrl,
    report,
    busy,
    error,
    history,
    historyLoading,
    loadHistory,
    run,
  } = useImport();

  const canRun = mode === "file" ? !!file : !!url;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl">Імпорт каталогу (CSV)</h1>
      <p className="text-sm text-[color:var(--ab-muted)]">
        Колонки: Код, Автор, Название, Заголовок, Год, Город, Издательство,
        Обложка, Количество страниц, Цена, Примечания, Тема. Розділювач: tab,
        кома або крапка з комою — визначається автоматично.
      </p>

      <ImportSourcePicker
        mode={mode}
        onMode={changeMode}
        url={url}
        onUrl={setUrl}
        defaultUrl={defaultUrl}
        onFile={setFile}
      />

      <ImportActions
        busy={busy}
        canRun={canRun}
        canCommit={!!report && !(mode === "file" && !file)}
        onRun={run}
      />

      {busy && <div className="text-sm">Виконується…</div>}
      {error && <div style={{ color: "#c0392b" }}>{error}</div>}
      {report && <ImportReportView report={report} />}

      <ImportHistoryTable
        rows={history}
        loading={historyLoading}
        onReload={loadHistory}
      />
    </div>
  );
}
