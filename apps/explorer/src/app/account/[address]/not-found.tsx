import Link from "next/link";
import { IconSearchOff as SearchX } from "@tabler/icons-react";
import { buttonVariants } from "@cosmos-explorer/ui/button";

export default function AccountNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium">Account not found</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          The account you are looking for does not exist or has no on-chain activity.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Back to Overview
      </Link>
    </div>
  );
}
