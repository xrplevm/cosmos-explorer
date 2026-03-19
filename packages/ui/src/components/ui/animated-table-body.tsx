"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TableCell, TableRow } from "./table";
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
    <tbody className="[&_tr:last-child]:border-0">
      {data.map((row) => {
        const isNew = newKeys.has(rowKey(row));
        return (
          <TableRow key={rowKey(row)} className="h-[50px]">
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                <motion.div
                  initial={isNew ? { opacity: 0, height: 0 } : false}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {col.render(row)}
                </motion.div>
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </tbody>
  );
}
