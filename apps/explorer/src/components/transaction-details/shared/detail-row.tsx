export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="min-w-0 text-sm">{children}</div>
    </div>
  );
}
