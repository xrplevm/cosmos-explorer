import { ProposalContent } from "../../shared/proposal-content-parts";
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
      <ProposalContent.Card title="Update Parameters">
        <ProposalContent.Description>{proposal.description}</ProposalContent.Description>
        <ProposalContent.AddressField label="Authority" address={content?.authority} />
        <ProposalContent.CodeBlock label="Parameters" value={content?.params} />
      </ProposalContent.Card>
  );
}
