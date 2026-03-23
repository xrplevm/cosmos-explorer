import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import type { ProposalDetail } from "@cosmos-explorer/core";

/* ─── Compound building blocks (mirrors explorer's ProposalContent) ───────── */

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-0">{children}</CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
        <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">{label}</span>
        <div className="min-w-0 text-sm">{children}</div>
      </div>
    </>
  );
}

function Description({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">Description</span>
      <div className="min-w-0 text-sm">{children ?? "No description available."}</div>
    </div>
  );
}

function AddressField({ label, address }: { label: string; address: string | null | undefined }) {
  if (!address || address.length === 0) return null;
  return (
    <Row label={label}>
      <div className="flex min-w-0 flex-nowrap items-center gap-2">
        <span className="min-w-0 flex-1 break-all font-mono text-xs">{address}</span>
        <CopyButton value={address} label={label.toLowerCase()} size="xs" />
      </div>
    </Row>
  );
}

function MonoField({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null) return null;
  return <Row label={label}><span className="font-mono text-xs">{String(value)}</span></Row>;
}

function TextField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value || value.length === 0) return null;
  return <Row label={label}><span>{value}</span></Row>;
}

function CodeBlock({ label, value }: { label: string; value: unknown }) {
  if (value == null) return null;
  return (
    <Row label={label}>
      <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-2 text-xs">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </Row>
  );
}

function CoinList({ label, coins }: { label: string; coins: { denom?: string; amount?: string }[] | null | undefined }) {
  if (!Array.isArray(coins) || coins.length === 0) return null;
  return (
    <Row label={label}>
      <div className="space-y-1">
        {coins.map((coin, i) => (
          <div key={i} className="font-mono text-xs">{coin.amount ?? "0"} {coin.denom ?? ""}</div>
        ))}
      </div>
    </Row>
  );
}

function RawContent({ content }: { content: unknown }) {
  return (
    <Card>
      <CardHeader><CardTitle>Raw Content</CardTitle></CardHeader>
      <CardContent>
        <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(content, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

/* ─── Variant helpers ─────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function first(proposal: ProposalDetail): any {
  return Array.isArray(proposal.content) ? proposal.content[0] : undefined;
}

function parseBinaries(info: string | undefined): Record<string, string> | null {
  if (!info) return null;
  try {
    const parsed: unknown = JSON.parse(info);
    if (typeof parsed === "object" && parsed !== null && "binaries" in parsed) {
      const b = (parsed as { binaries: unknown }).binaries;
      if (typeof b === "object" && b !== null) return b as Record<string, string>;
    }
  } catch { /* ignore */ }
  return null;
}

/* ─── Variants ────────────────────────────────────────────────────────────── */

function SoftwareUpgrade({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  const plan = c?.plan;
  const binaries = parseBinaries(plan?.info);
  return (
    <div className="space-y-6">
      <ContentCard title="Software Upgrade">
        <Description>{proposal.description}</Description>
        <TextField label="Upgrade Name" value={plan?.name} />
        <MonoField label="Upgrade Height" value={plan?.height != null ? Number(plan.height).toLocaleString() : null} />
        <AddressField label="Authority" address={c?.authority} />
        {binaries != null && (
          <Row label="Binaries">
            <div className="space-y-2">
              {Object.entries(binaries).map(([platform, url]) => (
                <div key={platform}>
                  <p className="text-xs text-muted-foreground">{platform}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-primary hover:underline">{url}</a>
                </div>
              ))}
            </div>
          </Row>
        )}
        <CodeBlock label="Upgraded Client State" value={plan?.upgraded_client_state} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function CommunityPoolSpend({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  return (
    <div className="space-y-6">
      <ContentCard title="Community Pool Spend">
        <Description>{proposal.description}</Description>
        <AddressField label="Recipient" address={c?.recipient} />
        <CoinList label="Amount" coins={c?.amount} />
        <AddressField label="Authority" address={c?.authority} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function ParameterChange({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  const changes = c?.changes as { subspace?: string; key?: string; value?: string }[] | undefined;
  return (
    <div className="space-y-6">
      <ContentCard title="Parameter Change">
        <Description>{proposal.description}</Description>
        <AddressField label="Authority" address={c?.authority} />
        {Array.isArray(changes) && changes.length > 0 && (
          <Row label="Changes">
            <div className="space-y-3">
              {changes.map((change, i) => (
                <div key={i} className="rounded-md border border-border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Subspace:</span>
                    <span className="font-mono text-xs font-medium">{change.subspace ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Key:</span>
                    <span className="font-mono text-xs font-medium">{change.key ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Value:</span>
                    <pre className="mt-1 max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">{change.value ?? "N/A"}</pre>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        )}
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function TextProposal({ proposal }: { proposal: ProposalDetail }) {
  return (
    <div className="space-y-6">
      <ContentCard title="Text Proposal">
        <div className="py-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {proposal.description || "No description available."}
        </div>
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function AddValidator({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  const desc = c?.description as { moniker?: string; identity?: string; website?: string; security_contact?: string; details?: string } | undefined;
  const commission = c?.commission as { rate?: string; max_rate?: string; max_change_rate?: string } | undefined;
  return (
    <div className="space-y-6">
      <ContentCard title="Add Validator">
        <Description>{proposal.description}</Description>
        <TextField label="Moniker" value={c?.moniker ?? desc?.moniker} />
        <AddressField label="Validator Address" address={c?.validator_address} />
        <AddressField label="Authority" address={c?.authority} />
        <MonoField label="Identity" value={desc?.identity} />
        <TextField label="Website" value={desc?.website} />
        <TextField label="Security Contact" value={desc?.security_contact} />
        <TextField label="Validator Details" value={desc?.details} />
        {commission != null && (
          <Row label="Commission">
            <div className="space-y-1 text-xs">
              {commission.rate != null && <div>Rate: <span className="font-mono">{commission.rate}</span></div>}
              {commission.max_rate != null && <div>Max Rate: <span className="font-mono">{commission.max_rate}</span></div>}
              {commission.max_change_rate != null && <div>Max Change Rate: <span className="font-mono">{commission.max_change_rate}</span></div>}
            </div>
          </Row>
        )}
        <MonoField label="Min Self Delegation" value={c?.min_self_delegation} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function RemoveValidator({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  const desc = c?.description as { moniker?: string } | undefined;
  return (
    <div className="space-y-6">
      <ContentCard title="Remove Validator">
        <Description>{proposal.description}</Description>
        <TextField label="Moniker" value={c?.moniker ?? desc?.moniker} />
        <AddressField label="Validator Address" address={c?.validator_address} />
        <AddressField label="Authority" address={c?.authority} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function CancelUpgrade({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  return (
    <div className="space-y-6">
      <ContentCard title="Cancel Software Upgrade">
        <Description>{proposal.description}</Description>
        <AddressField label="Authority" address={c?.authority} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function UpdateParams({ proposal }: { proposal: ProposalDetail }) {
  const c = first(proposal);
  return (
    <div className="space-y-6">
      <ContentCard title="Update Parameters">
        <Description>{proposal.description}</Description>
        <AddressField label="Authority" address={c?.authority} />
        <CodeBlock label="Parameters" value={c?.params} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

function Default({ proposal }: { proposal: ProposalDetail }) {
  return (
    <div className="space-y-6">
      <ContentCard title={proposal.type}>
        <Description>{proposal.description}</Description>
        <MonoField label="Type" value={proposal.type} />
      </ContentCard>
      <RawContent content={proposal.content} />
    </div>
  );
}

/* ─── Root dispatcher ─────────────────────────────────────────────────────── */

export function ProposalContentRoot({ proposal }: { proposal: ProposalDetail }) {
  switch (proposal.type) {
    case "SoftwareUpgrade":
      return <SoftwareUpgrade proposal={proposal} />;
    case "CommunityPoolSpend":
      return <CommunityPoolSpend proposal={proposal} />;
    case "ParameterChange":
      return <ParameterChange proposal={proposal} />;
    case "Text":
      return <TextProposal proposal={proposal} />;
    case "AddValidator":
      return <AddValidator proposal={proposal} />;
    case "RemoveValidator":
      return <RemoveValidator proposal={proposal} />;
    case "CancelUpgrade":
      return <CancelUpgrade proposal={proposal} />;
    case "UpdateParams":
      return <UpdateParams proposal={proposal} />;
    default:
      return <Default proposal={proposal} />;
  }
}
