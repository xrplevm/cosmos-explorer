interface ComponentPreviewProps {
  title?: string;
  children: React.ReactNode;
}

export function ComponentPreview({ title, children }: ComponentPreviewProps) {
  return (
    <div className="rounded-lg border border-border">
      {title && (
        <div className="border-b border-border px-4 py-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
      )}
      <div className="flex items-center justify-center gap-4 p-8">
        {children}
      </div>
    </div>
  );
}
