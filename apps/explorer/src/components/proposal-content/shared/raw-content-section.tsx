"use client";

import { useMemo, useState, useEffect } from "react";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import type { ContentMessage } from "./message-helpers";
import { MessagesView } from "./messages-view";

export function RawContentSection({ content }: { content: unknown }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messages = useMemo(() => {
    if (!Array.isArray(content)) return [];
    return content.filter(
      (item): item is ContentMessage =>
        typeof item === "object" && item !== null,
    );
  }, [content]);

  const prettyJson = useMemo(
    () => JSON.stringify(content, null, 2),
    [content],
  );

  const jsonViewStyle = useMemo(() => {
    if (!mounted) return darkTheme;
    return resolvedTheme === "light" ? lightTheme : darkTheme;
  }, [mounted, resolvedTheme]);

  const jsonValue = useMemo(() => {
    if (Array.isArray(content)) return content as object[];
    if (typeof content === "object" && content !== null) return content;
    return { value: content };
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setShowRaw(!showRaw); }}
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
                  showRaw ? "bg-primary border-primary" : "bg-muted border-border",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 rounded-full bg-foreground transition-transform",
                    showRaw ? "translate-x-[18px]" : "translate-x-[3px]",
                  )}
                />
              </span>
              Raw
            </button>
            <CopyButton
              value={prettyJson}
              label="content"
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRaw ? (
          <div
            className={cn(
              "max-h-[min(28rem,60vh)] overflow-auto rounded-md border border-border",
              "bg-muted/30 p-3",
            )}
          >
            <JsonView
              value={jsonValue}
              style={jsonViewStyle}
              shortenTextAfterLength={0}
              displayDataTypes={false}
            />
          </div>
        ) : (
          <MessagesView messages={messages} />
        )}
      </CardContent>
    </Card>
  );
}
