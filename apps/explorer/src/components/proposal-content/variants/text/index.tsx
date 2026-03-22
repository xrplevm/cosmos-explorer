import { ProposalContent } from "../../shared/proposal-content-parts";
import { RawContentSection } from "../../shared/raw-content-section";
import type { ProposalContentViewProps } from "../../types";

export function TextContent({ proposal }: ProposalContentViewProps) {
  return (
    <div className="space-y-6">
      <ProposalContent.Card title="Text Proposal">
        <div className="py-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {proposal.description || "No description available."}
        </div>
      </ProposalContent.Card>

      <RawContentSection content={proposal.content} />
    </div>
  );
}
