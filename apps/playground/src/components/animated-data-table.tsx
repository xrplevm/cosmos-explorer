"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { AnimatedTableBody } from "@cosmos-explorer/ui/animated-table-body";
import type { Column } from "@cosmos-explorer/ui/data-table";

interface AnimatedDataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
}

export function AnimatedDataTable<T>({
  title,
  columns,
  data,
  rowKey,
}: AnimatedDataTableProps<T>) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <span className="text-sm text-muted-foreground">See More</span>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <AnimatedTableBody
              columns={columns}
              data={data}
              rowKey={rowKey}
            />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
