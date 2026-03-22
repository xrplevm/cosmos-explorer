import type { ProposalDetail } from "@cosmos-explorer/core";

export interface ProposalContentViewProps {
  proposal: ProposalDetail;
}

export interface ProposalContentItem {
  "@type"?: string;
  [key: string]: unknown;
}
