"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cosmos-explorer/ui/select";

export function NetworkSwitcher({
  chainEnv,
  explorerUrls,
}: {
  chainEnv: string;
  explorerUrls: Record<string, string>;
}) {
  return (
    <Select
      value={chainEnv}
      onValueChange={(value) => {
        const url = explorerUrls[value];
        if (url && value !== chainEnv) {
          window.location.href = url;
        }
      }}
    >
      <SelectTrigger className="h-8 w-28 text-xs capitalize">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(explorerUrls).map((env) => (
          <SelectItem key={env} value={env} className="text-xs capitalize">
            {env}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
