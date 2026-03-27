import { ProposalContent } from "../../shared/proposal-content-parts";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface CommunityPoolSpendValue extends ProposalContentItem {
  recipient?: string;
  amount?: { denom?: string; amount?: string }[];
  authority?: string;
}

export function CommunityPoolSpendContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as CommunityPoolSpendValue | undefined)
    : undefined;

  return (
      <ProposalContent.Card title="Community Pool Spend">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.AddressField label="Recipient" address={content?.recipient} />
        <ProposalContent.CoinList label="Amount" coins={content?.amount} />
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
      </ProposalContent.Card>
  );
}
