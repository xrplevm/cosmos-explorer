import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface RemoveValidatorValue extends ProposalContentItem {
  authority?: string;
  sender?: string;
  validator_address?: string;
  validatorAddress?: string;
  moniker?: string;
  description?: {
    moniker?: string;
  };
}

export function RemoveValidatorContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as RemoveValidatorValue | undefined)
    : undefined;

  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Remove Validator">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.TextField
          label="Moniker"
          value={content?.moniker ?? content?.description?.moniker}
        />
        <ProposalContent.AddressField
          label="Validator Address"
          address={content?.validator_address ?? content?.validatorAddress}
        />
        <ProposalContent.AddressField
          label="Authority"
          address={content?.authority ?? content?.sender}
        />
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
