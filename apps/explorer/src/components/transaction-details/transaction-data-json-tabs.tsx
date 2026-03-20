"use client";

import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cosmos-explorer/ui/tabs";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { enrichMessageValueForTransactionViewer } from "@/lib/ethereum-message-decode";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";
import { transactionRawWireString } from "@/lib/transaction-raw-string";
import type { TransactionDataTabsPayload } from "./types";

export function TransactionDataJsonTabs({
  payload,
}: {
  payload: TransactionDataTabsPayload;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayPayload = useMemo(
    () => ({
      messages: payload.messages.map((m) => ({
        type: m.type,
        value: enrichMessageValueForTransactionViewer(
          parseJsonIfString(m.value),
        ),
      })),
      logs: parseJsonIfString(payload.logs),
      error: parseJsonIfString(payload.error),
    }),
    [payload],
  );

  const prettyJson = useMemo(
    () => JSON.stringify(displayPayload, null, 2),
    [displayPayload],
  );

  /** Opaque wire string (hex / logs / raw_log), not JSON. */
  const rawString = useMemo(() => transactionRawWireString(payload), [payload]);

  const [activeTab, setActiveTab] = useState("json");

  const jsonViewStyle = useMemo(() => {
    if (!mounted) {
      return darkTheme;
    }
    return resolvedTheme === "light" ? lightTheme : darkTheme;
  }, [mounted, resolvedTheme]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="json" className="mt-4 space-y-3">
        <div className="flex justify-end">
          <CopyButton
            value={prettyJson}
            label="JSON"
            variant="outline"
            size="sm"
          />
        </div>
        {activeTab === "json" ? (
          <div
            className={cn(
              "max-h-[min(28rem,60vh)] overflow-auto rounded-md border border-border",
              "bg-muted/30 p-3",
            )}
          >
            <JsonView
              value={displayPayload}
              style={jsonViewStyle}
              shortenTextAfterLength={0}
              displayDataTypes={false}
            />
          </div>
        ) : null}
      </TabsContent>

      <TabsContent value="raw" className="mt-4 space-y-3">
        <div className="flex justify-end">
          <CopyButton
            value={rawString}
            label="raw payload"
            variant="outline"
            size="sm"
          />
        </div>
        <textarea
          readOnly
          value={rawString}
          placeholder="No raw payload (no EVM raw hex, string logs, or error text)."
          spellCheck={false}
          aria-label="Raw transaction payload"
          className={cn(
            "max-h-[min(28rem,60vh)] min-h-48 w-full resize-y rounded-md border border-border",
            "bg-muted/30 p-3 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
