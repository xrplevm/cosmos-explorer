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

// ── Message type helpers ────────────────────────────────────────────────────

interface ContentMessage {
  "@type"?: string;
  moniker?: string;
  description?: { moniker?: string };
  validator_address?: string;
  validatorAddress?: string;
  authority?: string;
  sender?: string;
  plan?: { name?: string; height?: string };
  amount?: { denom?: string; amount?: string }[] | { denom?: string; amount?: string };
  recipient?: string;
  [key: string]: unknown;
}

function shortType(fullType: string): string {
  return fullType.split(".").pop()?.split("/").pop() ?? fullType;
}

const TYPE_COLORS: Record<string, string> = {
  MsgRemoveValidator: "bg-red-500/20 text-red-400 border-red-500/30",
  RemoveValidator: "bg-red-500/20 text-red-400 border-red-500/30",
  MsgAddValidator: "bg-green-500/20 text-green-400 border-green-500/30",
  AddValidator: "bg-green-500/20 text-green-400 border-green-500/30",
  MsgSoftwareUpgrade: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SoftwareUpgrade: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  SoftwareUpgradeProposal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MsgCancelUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CancelUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CancelSoftwareUpgrade: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MsgCommunityPoolSpend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CommunityPoolSpend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MsgUpdateParams: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  UpdateParams: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  ParameterChange: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  ParameterChangeProposal: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  TextProposal: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  Text: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

function getMoniker(msg: ContentMessage): string | null {
  return msg.moniker ?? msg.description?.moniker ?? null;
}

function getValidatorAddress(msg: ContentMessage): string | null {
  return msg.validator_address ?? msg.validatorAddress ?? null;
}

function MessageDescription({ msg, typeName }: { msg: ContentMessage; typeName: string }) {
  const moniker = getMoniker(msg);
  const address = getValidatorAddress(msg);

  // Validator-related messages
  if (typeName.includes("RemoveValidator")) {
    return (
      <span className="flex items-center gap-2">
        Remove
        {moniker && <ValidatorChip moniker={moniker} colorClass="bg-red-500/15 text-red-400" />}
        validator
      </span>
    );
  }
  if (typeName.includes("AddValidator")) {
    return (
      <span className="flex items-center gap-2">
        Add
        {moniker && <ValidatorChip moniker={moniker} colorClass="bg-green-500/15 text-green-400" />}
        validator
      </span>
    );
  }

  // Software upgrade
  if (typeName.includes("SoftwareUpgrade") && !typeName.includes("Cancel")) {
    const name = msg.plan?.name;
    return <span>Software upgrade{name ? ` to ${name}` : ""}{msg.plan?.height ? ` at height ${Number(msg.plan.height).toLocaleString()}` : ""}</span>;
  }
  if (typeName.includes("Cancel") && typeName.includes("Upgrade")) {
    return <span>Cancel software upgrade</span>;
  }

  // Community pool spend
  if (typeName.includes("CommunityPoolSpend")) {
    const recipient = msg.recipient as string | undefined;
    return (
      <span>
        Community pool spend
        {recipient ? <> to <span className="font-mono text-xs">{recipient.slice(0, 12)}…{recipient.slice(-6)}</span></> : ""}
      </span>
    );
  }

  // Params
  if (typeName.includes("UpdateParams") || typeName.includes("ParameterChange")) {
    return <span>Update parameters</span>;
  }

  // Text
  if (typeName.includes("Text")) {
    return <span>Text proposal</span>;
  }

  // Fallback: show authority or address
  if (address) {
    return (
      <span className="font-mono text-xs text-muted-foreground">
        {address.slice(0, 16)}…{address.slice(-8)}
      </span>
    );
  }

  return <span className="text-muted-foreground">—</span>;
}

function ValidatorChip({ moniker, colorClass }: { moniker: string; colorClass: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${colorClass}`}>
        {moniker.slice(0, 2).toUpperCase()}
      </span>
      <span className="font-medium">{moniker}</span>
    </span>
  );
}

// ── Messages view ───────────────────────────────────────────────────────────

function MessagesView({ messages }: { messages: ContentMessage[] }) {
  if (messages.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No messages.</p>;
  }

  return (
    <div className="space-y-2">
      {messages.map((msg, i) => {
        const fullType = msg["@type"] ?? "Unknown";
        const typeName = shortType(fullType);

        return (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5"
          >
            <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold", getTypeColor(typeName))}>
              {typeName}
            </span>
            <span className="min-w-0 text-sm">
              <MessageDescription msg={msg} typeName={typeName} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

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
