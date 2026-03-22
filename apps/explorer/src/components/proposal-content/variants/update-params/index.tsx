import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps, ProposalContentItem } from "../../types";

interface UpdateParamsValue extends ProposalContentItem {
  authority?: string;
  params?: Record<string, unknown>;
}

export function UpdateParamsContent({ proposal }: ProposalContentViewProps) {
  const content = Array.isArray(proposal.content)
    ? (proposal.content[0] as UpdateParamsValue | undefined)
    : undefined;

  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Update Parameters">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
        <ProposalContent.CodeBlock label="Parameters" value={content?.params} />
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
