"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ComponentPreview } from "@/components/component-preview";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import { AnimatedDataTable } from "@/components/animated-data-table";
import type { Column, SkeletonColumn } from "@/components/data-table";

interface DataTableShowcaseProps<T> {
  title: string;
  description: string;
  tableTitle: string;
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
}

interface TaggedRow<T> {
  uid: number;
  row: T;
}

function AnimatedDemo<T>({
  tableTitle,
  columns,
  data,
}: Omit<DataTableShowcaseProps<T>, "title" | "description" | "rowKey">) {
  const counter = useRef(data.length);
  const pointer = useRef(0);

  const seed = useCallback((): TaggedRow<T>[] =>
    data.slice(0, 4).map((row, i) => ({ uid: i, row })),
    [data],
  );

  const [rows, setRows] = useState<TaggedRow<T>[]>(seed);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = pointer.current % data.length;
      pointer.current += 1;
      const uid = counter.current;
      counter.current += 1;
      setRows((prev) => [{ uid, row: data[idx] }, ...prev.slice(0, 5)]);
    }, 4000);
    return () => { clearInterval(interval); };
  }, [data]);

  const taggedColumns: Column<TaggedRow<T>>[] = columns.map((col) => ({
    ...col,
    render: (tagged: TaggedRow<T>) => col.render(tagged.row),
  }));

  return (
    <AnimatedDataTable
      title={tableTitle}
      columns={taggedColumns}
      data={rows}
      rowKey={(tagged) => tagged.uid}
    />
  );
}

export function DataTableShowcase<T>({
  title,
  description,
  tableTitle,
  columns,
  data,
  rowKey,
}: DataTableShowcaseProps<T>) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <div className="w-full">
            <DataTable
              title={tableTitle}
              columns={columns}
              data={data}
              rowKey={rowKey}
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Animated</h2>
        <p className="text-sm text-muted-foreground">
          New rows appear at the top every 2 seconds with enter animations.
        </p>
        <ComponentPreview>
          <div className="w-full">
            <AnimatedDemo
              tableTitle={tableTitle}
              columns={columns}
              data={data}
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Loading skeleton</h2>
        <ComponentPreview>
          <div className="w-full">
            <DataTableSkeleton
              title={tableTitle}
              columns={columns.map((col) => ({
                key: col.key,
                header: col.header,
                className: col.className,
              }))}
            />
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
