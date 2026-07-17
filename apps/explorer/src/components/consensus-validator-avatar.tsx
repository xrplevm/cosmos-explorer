"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@cosmos-explorer/ui/avatar";
import { cn } from "@cosmos-explorer/ui/lib/utils";

// Shared Avatar with initials fallback (as in the validators table); Radix
// swaps to the fallback itself when there's no avatarUrl or the image breaks.
export function ValidatorAvatar({
  avatarUrl,
  mono,
  className,
}: {
  avatarUrl: string | null;
  mono: string;
  className?: string;
}) {
  return (
    <Avatar aria-hidden className={cn("rounded-[5px]", className)}>
      {avatarUrl != null && avatarUrl.length > 0 && (
        <AvatarImage src={avatarUrl} alt="" className="object-cover" />
      )}
      <AvatarFallback className="rounded-[5px] font-mono text-[9px] font-bold">
        {mono}
      </AvatarFallback>
    </Avatar>
  );
}
