import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps } from "../../types";

export function DefaultContent({ proposal }: ProposalContentViewProps) {
  return (
    <div className="space-y-6">
      <ProposalContent.Card title={proposal.type}>
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.MonoField label="Type" value={proposal.type} />
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
