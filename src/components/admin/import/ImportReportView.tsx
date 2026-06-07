import type { ImportReport } from "@/lib/ApiClient";

export function ImportReportView({ report }: { report: ImportReport }) {
  return (
    <div
      className="border p-3 text-sm space-y-1"
      style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
    >
      <div>Розпарсено рядків: <b>{report.parsed}</b></div>
      <div>Буде створено: <b>{report.toCreate}</b></div>
      <div>Буде оновлено: <b>{report.toUpdate}</b></div>
      <div>
        Буде видалено (немає в CSV):{" "}
        <b style={{ color: report.toDelete > 0 ? "#c0392b" : undefined }}>
          {report.toDelete}
        </b>
      </div>
      <div>Нових категорій: <b>{report.categoriesCreated}</b></div>
      <div>Стан: {report.committed ? "ЗАСТОСОВАНО" : "ПРОБНИЙ (не записано)"}</div>
      {report.errors.length > 0 && (
        <details>
          <summary>Помилки ({report.errors.length})</summary>
          <ul className="ml-4 list-disc">
            {report.errors.slice(0, 50).map((e, i) => (
              <li key={i}>
                Рядок {e.line}: {e.message}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
