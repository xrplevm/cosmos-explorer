import { TableBody, TableCell, TableRow } from "./table";
import type { Column } from "./data-table";

interface AnimatedTableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
}

export function AnimatedTableBody<T>({
  columns,
  data,
  rowKey,
}: AnimatedTableBodyProps<T>) {
  return (
    <TableBody>
      {data.map((row) => (
        <TableRow key={rowKey(row)}>
          {columns.map((col) => (
            <TableCell key={col.key} className={col.className}>
              {col.render(row)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
