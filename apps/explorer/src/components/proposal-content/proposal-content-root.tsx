import type { ProposalContentViewProps } from "./types";
import { SoftwareUpgradeContent } from "./variants/software-upgrade";
import { CommunityPoolSpendContent } from "./variants/community-pool-spend";
import { ParameterChangeContent } from "./variants/parameter-change";
import { TextContent } from "./variants/text";
import { AddValidatorContent } from "./variants/add-validator";
import { RemoveValidatorContent } from "./variants/remove-validator";
import { CancelUpgradeContent } from "./variants/cancel-upgrade";
import { UpdateParamsContent } from "./variants/update-params";
import { DefaultContent } from "./variants/default";

export function ProposalContentRoot({ proposal }: ProposalContentViewProps) {
  switch (proposal.type) {
    // Upgrade
    case "SoftwareUpgrade":
    case "SoftwareUpgradeProposal":
      return <SoftwareUpgradeContent proposal={proposal} />;
    case "CancelUpgrade":
    case "CancelSoftwareUpgrade":
    case "CancelSoftwareUpgradeProposal":
      return <CancelUpgradeContent proposal={proposal} />;

    // Distribution
    case "CommunityPoolSpend":
    case "CommunityPoolSpendProposal":
      return <CommunityPoolSpendContent proposal={proposal} />;

    // Params
    case "ParameterChange":
    case "ParameterChangeProposal":
      return <ParameterChangeContent proposal={proposal} />;
    case "UpdateParams":
      return <UpdateParamsContent proposal={proposal} />;

    // Text
    case "Text":
    case "TextProposal":
      return <TextContent proposal={proposal} />;

    // Custom / chain-specific
    case "AddValidator":
      return <AddValidatorContent proposal={proposal} />;
    case "RemoveValidator":
      return <RemoveValidatorContent proposal={proposal} />;

    default:
      return <DefaultContent proposal={proposal} />;
  }
}
