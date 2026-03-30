import { ProposalContent } from "../../shared/proposal-content-parts";
import type { ProposalContentViewProps } from "../../types";

export function DefaultContent({ proposal }: ProposalContentViewProps) {
  return (
      <ProposalContent.Card title={proposal.type}>
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.MonoField label="Type" value={proposal.type} />
      </ProposalContent.Card>
  );
}
