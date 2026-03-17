"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Block } from "@cosmos-explorer/core";
import { TableCell, TableRow } from "@cosmos-explorer/ui/table";
import { motion } from "framer-motion";

import { formatHash } from "@/lib/formatters";
import { RelativeTime } from "@/components/relative-time";

export function BlocksTableBody({ blocks }: { blocks: Block[] }) {
  const prevTopHash = useRef(blocks[0]?.hash);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (blocks[0]?.hash && blocks[0].hash !== prevTopHash.current) {
      const prevSet = new Set([prevTopHash.current]);
      const fresh = blocks.filter((b) => !prevSet.has(b.hash)).map((b) => b.hash);
      setNewKeys(new Set(fresh));
      prevTopHash.current = blocks[0].hash;

      const timeout = setTimeout(() => { setNewKeys(new Set()); }, 1500);
      return () => { clearTimeout(timeout); };
    }
  }, [blocks]);

  return (
    <tbody className="[&_tr:last-child]:border-0">
      {blocks.map((block) => {
        const isNew = newKeys.has(block.hash);

        return (
          <TableRow key={block.hash} className="h-[50px]">
            {[
              {
                key: "height",
                content: (
                  <Link
                    href={`/blocks/${block.height}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {block.height.toLocaleString()}
                  </Link>
                ),
              },
              {
                key: "proposer",
                content: (
                  <div className="flex items-center gap-2">
                    {block.proposerAvatarUrl ? (
                      <img
                        src={block.proposerAvatarUrl}
                        alt={block.proposerMoniker ?? block.proposer}
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {(block.proposerMoniker ?? block.proposer).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <Link
                      href={`/validators/${block.proposer}`}
                      className="text-sm text-primary hover:underline truncate max-w-[120px]"
                    >
                      {block.proposerMoniker ?? block.proposer}
                    </Link>
                  </div>
                ),
              },
              {
                key: "hash",
                content: (
                  <span className="font-mono text-sm text-muted-foreground">
                    {formatHash(block.hash)}
                  </span>
                ),
              },
              {
                key: "txs",
                content: block.txs,
              },
              {
                key: "time",
                content: (
                  <span className="text-muted-foreground">
                    <RelativeTime timestamp={block.timestamp} />
                  </span>
                ),
              },
            ].map((cell) => (
              <TableCell key={cell.key}>
                <motion.div
                  initial={isNew ? { opacity: 0, height: 0 } : false}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ overflow: "hidden", display: "flex", alignItems: "center" }}
                >
                  {cell.content}
                </motion.div>
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </tbody>
  );
}
