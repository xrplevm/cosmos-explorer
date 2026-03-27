import { ProposalContent } from "../../shared/proposal-content-parts";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface CancelUpgradeValue extends ProposalContentItem {
  authority?: string;
}

export function CancelUpgradeContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as CancelUpgradeValue | undefined)
    : undefined;

  return (
      <ProposalContent.Card title="Cancel Software Upgrade">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
      </ProposalContent.Card>
  );
}
