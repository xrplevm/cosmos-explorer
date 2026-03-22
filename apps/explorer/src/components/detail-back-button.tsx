import Link from "next/link";
import { IconArrowLeft as ArrowLeft } from "@tabler/icons-react";
import { Button } from "@cosmos-explorer/ui/button";

export function DetailBackButton({ href }: { href: string }) {
  return (
    <Button variant="ghost" size="icon" className="shrink-0" asChild>
      <Link href={href} aria-label="Back">
        <ArrowLeft />
      </Link>
    </Button>
  );
}
