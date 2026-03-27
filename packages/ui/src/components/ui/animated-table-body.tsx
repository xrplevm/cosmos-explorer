"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  const prevFirstKey = useRef<string | number | undefined>(
    data[0] ? rowKey(data[0]) : undefined,
  );
  const prevKeysRef = useRef<Set<string | number>>(
    new Set(data.map((r) => rowKey(r))),
  );
  const [newKeys, setNewKeys] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const currentFirst = data[0] ? rowKey(data[0]) : undefined;
    if (currentFirst != null && currentFirst !== prevFirstKey.current) {
      const prevKeys = prevKeysRef.current;
      const fresh = new Set<string | number>();
      for (const row of data) {
        const k = rowKey(row);
        if (prevKeys.has(k)) break;
        fresh.add(k);
      }
      setNewKeys(fresh);
      prevFirstKey.current = currentFirst;
      prevKeysRef.current = new Set(data.map((r) => rowKey(r)));

      const timeout = setTimeout(() => {
        setNewKeys(new Set());
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [data, rowKey]);

  return (
    <TableBody>
      {data.map((row, rowIndex) => {
        const isNew = newKeys.has(rowKey(row));
        return (
          <motion.tr
            key={rowKey(row)}
            initial={
              isNew
                ? { opacity: 0, y: -10, backgroundColor: "oklch(0.53 0.274 290.728 / 0.10)" }
                : false
            }
            animate={{ opacity: 1, y: 0, backgroundColor: "oklch(0.53 0.274 290.728 / 0)" }}
            transition={{
              opacity: { duration: 0.3, ease: "easeOut", delay: rowIndex * 0.04 },
              y: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: rowIndex * 0.04 },
              backgroundColor: { duration: 1.2, ease: "easeOut" },
            }}
            className="border-b border-border hover:bg-muted/50"
          >
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.render(row)}
              </TableCell>
            ))}
          </motion.tr>
        );
      })}
    </TableBody>
  );
}
