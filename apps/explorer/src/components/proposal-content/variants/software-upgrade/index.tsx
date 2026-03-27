import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface UpgradePlan {
  name?: string;
  height?: string;
  time?: string;
  info?: string;
  upgraded_client_state?: unknown;
}

interface SoftwareUpgradeValue extends ProposalContentItem {
  plan?: UpgradePlan;
  authority?: string;
}

function parseBinaries(info: string | undefined): Record<string, string> | null {
  if (!info) return null;
  try {
    const parsed: unknown = JSON.parse(info);
    if (typeof parsed === "object" && parsed !== null && "binaries" in parsed) {
      const binaries = (parsed as { binaries: unknown }).binaries;
      if (typeof binaries === "object" && binaries !== null) {
        return binaries as Record<string, string>;
      }
    }
  } catch {
    // not JSON
  }
  return null;
}

export function SoftwareUpgradeContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as SoftwareUpgradeValue | undefined)
    : undefined;
  const plan = content?.plan;
  const binaries = parseBinaries(plan?.info);

  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Software Upgrade">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.TextField label="Upgrade Name" value={plan?.name} />
        <ProposalContent.MonoField
          label="Upgrade Height"
          value={plan?.height != null ? Number(plan.height).toLocaleString() : null}
        />
        {plan?.time != null && plan.time !== "0001-01-01T00:00:00Z" && (
          <ProposalContent.TextField label="Upgrade Time" value={plan.time} />
        )}
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
        {binaries != null && (
          <ProposalContent.Row label="Binaries">
            <div className="space-y-2">
              {Object.entries(binaries).map(([platform, url]) => (
                <div key={platform}>
                  <p className="text-xs text-muted-foreground">{platform}</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-xs text-primary-soft hover:text-primary transition-colors"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </ProposalContent.Row>
        )}
        <ProposalContent.CodeBlock label="Upgraded Client State" value={plan?.upgraded_client_state} />
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
