import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface AddValidatorValue extends ProposalContentItem {
  authority?: string;
  sender?: string;
  validator_address?: string;
  validatorAddress?: string;
  moniker?: string;
  description?: {
    moniker?: string;
    identity?: string;
    website?: string;
    security_contact?: string;
    securityContact?: string;
    details?: string;
  };
  commission?: {
    rate?: string;
    max_rate?: string;
    maxRate?: string;
    max_change_rate?: string;
    maxChangeRate?: string;
  };
  min_self_delegation?: string;
  minSelfDelegation?: string;
}

export function AddValidatorContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as AddValidatorValue | undefined)
    : undefined;

  const desc = content?.description;
  const moniker = content?.moniker ?? desc?.moniker;
  const commission = content?.commission;

  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Add Validator">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.TextField label="Moniker" value={moniker} />
        <ProposalContent.AddressField
          label="Validator Address"
          address={content?.validator_address ?? content?.validatorAddress}
        />
        <ProposalContent.AddressField
          label="Authority"
          address={content?.authority ?? content?.sender}
        />
        <ProposalContent.MonoField label="Identity" value={desc?.identity} />
        <ProposalContent.TextField label="Website" value={desc?.website} />
        <ProposalContent.TextField
          label="Security Contact"
          value={desc?.security_contact ?? desc?.securityContact}
        />
        <ProposalContent.TextField label="Validator Details" value={desc?.details} />
        {commission != null && (
          <ProposalContent.Row label="Commission">
            <div className="space-y-1 text-xs">
              {commission.rate != null && (
                <div>Rate: <span className="font-mono">{commission.rate}</span></div>
              )}
              {(commission.max_rate ?? commission.maxRate) != null && (
                <div>Max Rate: <span className="font-mono">{commission.max_rate ?? commission.maxRate}</span></div>
              )}
              {(commission.max_change_rate ?? commission.maxChangeRate) != null && (
                <div>Max Change Rate: <span className="font-mono">{commission.max_change_rate ?? commission.maxChangeRate}</span></div>
              )}
            </div>
          </ProposalContent.Row>
        )}
        <ProposalContent.MonoField
          label="Min Self Delegation"
          value={content?.min_self_delegation ?? content?.minSelfDelegation}
        />
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
