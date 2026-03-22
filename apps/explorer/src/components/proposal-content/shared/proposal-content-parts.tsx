import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";

/* ─── Content Card ────────────────────────────────────────────────────────── */

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">{children}</CardContent>
    </Card>
  );
}

/* ─── Row (label / value with separator) ──────────────────────────────────── */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
        <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">
          {label}
        </span>
        <div className="min-w-0 text-sm">{children}</div>
      </div>
    </>
  );
}

/* ─── Description (always first, no leading separator) ────────────────────── */

function Description({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">
        Description
      </span>
      <div className="min-w-0 text-sm">
        {children || "No description available."}
      </div>
    </div>
  );
}

/* ─── Address field (monospace + copy button) ──────────────────────────────── */

function AddressField({
  label,
  address,
}: {
  label: string;
  address: string | null | undefined;
}) {
  if (!address || address.length === 0) return null;

  return (
    <Row label={label}>
      <div className="flex min-w-0 flex-nowrap items-center gap-2">
        <span className="min-w-0 flex-1 break-all font-mono text-xs">
          {address}
        </span>
        <CopyButton value={address} label={label.toLowerCase()} size="xs" />
      </div>
    </Row>
  );
}

/* ─── Mono field (monospace value) ─────────────────────────────────────────── */

function MonoField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value == null) return null;

  return (
    <Row label={label}>
      <span className="font-mono text-xs">{String(value)}</span>
    </Row>
  );
}

/* ─── Text field ──────────────────────────────────────────────────────────── */

function TextField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value || value.length === 0) return null;

  return (
    <Row label={label}>
      <span>{value}</span>
    </Row>
  );
}

/* ─── Code block field ────────────────────────────────────────────────────── */

function CodeBlock({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  if (value == null) return null;

  return (
    <Row label={label}>
      <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-2 text-xs">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </Row>
  );
}

/* ─── Coin amount list ────────────────────────────────────────────────────── */

function CoinList({
  label,
  coins,
}: {
  label: string;
  coins: { denom?: string; amount?: string }[] | null | undefined;
}) {
  if (!Array.isArray(coins) || coins.length === 0) return null;

  return (
    <Row label={label}>
      <div className="space-y-1">
        {coins.map((coin, i) => (
          <div key={i} className="font-mono text-xs">
            {coin.amount ?? "0"} {coin.denom ?? ""}
          </div>
        ))}
      </div>
    </Row>
  );
}

/* ─── Exports ─────────────────────────────────────────────────────────────── */

export const ProposalContent = {
  Card: ContentCard,
  Row,
  Description,
  AddressField,
  MonoField,
  TextField,
  CodeBlock,
  CoinList,
};
