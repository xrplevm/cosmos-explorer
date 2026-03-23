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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cosmos-explorer/ui/tabs";
import { cn } from "@cosmos-explorer/ui/lib/utils";

export function RawContentSection({ content }: { content: unknown }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("json");

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <CardTitle>Raw Content</CardTitle>
      </CardHeader>
      <CardContent>
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
                  value={jsonValue}
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
                value={prettyJson}
                label="raw content"
                variant="outline"
                size="sm"
              />
            </div>
            <textarea
              readOnly
              value={prettyJson}
              spellCheck={false}
              aria-label="Raw proposal content"
              className={cn(
                "max-h-[min(28rem,60vh)] min-h-48 w-full resize-y rounded-md border border-border",
                "bg-muted/30 p-3 font-mono text-xs leading-relaxed text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
