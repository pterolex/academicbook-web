export function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-4 rounded-md border bg-white ${className}`}
      style={{ borderColor: "#e2e8f0" }}
    >
      <div className="text-sm font-semibold mb-3" style={{ color: "#0f172a" }}>
        {title}
      </div>
      {children}
    </div>
  );
}
