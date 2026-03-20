import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";

function Root({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}

function Header({ children }: { children: ReactNode }) {
  return (
    <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
      {children}
    </CardHeader>
  );
}

function Title({ children }: { children?: ReactNode }) {
  return <CardTitle>{children ?? "Transaction data"}</CardTitle>;
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <CardContent>{children}</CardContent>;
}

/** Card shell for transaction data; compose `Header` + `Content` per transaction variant. */
export const TransactionDataSection = {
  Root,
  Header,
  Title,
  Actions,
  Content,
} as const;
